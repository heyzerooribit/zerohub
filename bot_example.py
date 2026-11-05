"""Minimal bot that loads zero_commands. Only needed if you don't already have a commands.Bot."""
import os
import discord
from discord.ext import commands


class ZeroBot(commands.Bot):
    def __init__(self):
        super().__init__(command_prefix="!", intents=discord.Intents.default())

    async def setup_hook(self):
        await self.load_extension("zero_commands")
        gid = os.environ.get("GUILD_ID")  # set this for instant command updates
        if gid:
            guild = discord.Object(id=int(gid))
            self.tree.copy_global_to(guild=guild)
            await self.tree.sync(guild=guild)
        else:
            await self.tree.sync()

    async def on_ready(self):
        print("Logged in as", self.user)


ZeroBot().run(os.environ["DISCORD_TOKEN"])
