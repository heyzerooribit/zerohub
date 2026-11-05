"""Slash commands for the ZERØ bot: /announce and /event.

Load it from your bot with:  await bot.load_extension("zero_commands")
Environment variables (set them on your bot host, never in this file):
  ANNOUNCEMENT_CHANNEL_ID  the channel your website reads
  OWNER_IDS                your Discord user ID (comma-separate more than one)
  TIMEZONE                 optional, default America/New_York
"""
import os
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import discord
from discord import app_commands
from discord.ext import commands

TZ = ZoneInfo(os.environ.get("TIMEZONE", "America/New_York"))
ANNOUNCE_CHANNEL = int(os.environ["ANNOUNCEMENT_CHANNEL_ID"])
OWNERS = {int(x) for x in os.environ.get("OWNER_IDS", "").split(",") if x.strip()}


def allowed(interaction: discord.Interaction) -> bool:
    """You (OWNER_IDS) or anyone with Manage Server."""
    if interaction.user.id in OWNERS:
        return True
    return interaction.guild is not None and interaction.user.guild_permissions.manage_guild


class AnnounceModal(discord.ui.Modal, title="New announcement"):
    text = discord.ui.TextInput(
        label="Message",
        style=discord.TextStyle.paragraph,
        max_length=1800,
        placeholder="Write your announcement. Line breaks are kept.",
    )

    def __init__(self, channel):
        super().__init__()
        self.channel = channel

    async def on_submit(self, interaction: discord.Interaction):
        msg = await self.channel.send(
            self.text.value, allowed_mentions=discord.AllowedMentions.none()
        )
        await interaction.response.send_message(f"Posted: {msg.jump_url}", ephemeral=True)


class ZeroCommands(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="announce", description="Post an announcement as the bot")
    @app_commands.guild_only()
    @app_commands.default_permissions(manage_guild=True)
    async def announce(self, interaction: discord.Interaction):
        if not allowed(interaction):
            return await interaction.response.send_message("Only the owner can do that.", ephemeral=True)
        channel = interaction.guild.get_channel(ANNOUNCE_CHANNEL) or await interaction.guild.fetch_channel(ANNOUNCE_CHANNEL)
        await interaction.response.send_modal(AnnounceModal(channel))

    @app_commands.command(name="event", description="Create a scheduled event")
    @app_commands.describe(
        name="Event name",
        start="Start time, 24-hour, like 2026-11-10 19:00",
        hours="How long it lasts (default 2)",
        description="What it is (optional)",
        location="Where it happens (default Discord)",
    )
    @app_commands.guild_only()
    @app_commands.default_permissions(manage_guild=True)
    async def event(
        self,
        interaction: discord.Interaction,
        name: str,
        start: str,
        hours: app_commands.Range[float, 0.25, 24] = 2,
        description: str = "",
        location: str = "Discord",
    ):
        if not allowed(interaction):
            return await interaction.response.send_message("Only the owner can do that.", ephemeral=True)
        try:
            begin = datetime.strptime(start.strip(), "%Y-%m-%d %H:%M").replace(tzinfo=TZ)
        except ValueError:
            return await interaction.response.send_message(
                "Use the format YYYY-MM-DD HH:MM in 24-hour time, like 2026-11-10 19:00.", ephemeral=True
            )
        if begin <= datetime.now(TZ):
            return await interaction.response.send_message("That time is in the past.", ephemeral=True)
        await interaction.response.defer(ephemeral=True)
        try:
            ev = await interaction.guild.create_scheduled_event(
                name=name,
                description=description or discord.utils.MISSING,
                start_time=begin,
                end_time=begin + timedelta(hours=hours),
                entity_type=discord.EntityType.external,
                privacy_level=discord.PrivacyLevel.guild_only,
                location=location,
            )
        except discord.Forbidden:
            return await interaction.followup.send("I don't have permission to create events here.", ephemeral=True)
        await interaction.followup.send(f"Event created: {ev.url}", ephemeral=True)


async def setup(bot: commands.Bot):
    await bot.add_cog(ZeroCommands(bot))
