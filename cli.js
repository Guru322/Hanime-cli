#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { getTrending, getVideo } from './hanime.js';
import pkg from './package.json' assert { type: 'json' };
import inquirer from 'inquirer';
import { spawn } from 'child_process';

program
  .name('hanime-cli')
  .description('CLI for Hanime TV API')
  .version(pkg.version);

program.command('trending')
  .description('Get trending videos')
  .option('-t, --time <time>', 'Time range (today, week, month)', 'today')
  .option('-p, --page <page>', 'Page number', '1')
  .action(async (options) => {
    try {
      const videos = await getTrending(options.time, options.page);
      videos.forEach((video, index) => {
        console.log(chalk.green(`${index + 1}. ${video.name}`));
        console.log(`   ID: ${video.id}`);
        console.log(`   Views: ${video.views}`);
        console.log(`   Link: ${chalk.blue(video.link)}`);
        console.log();
      });
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program.command('video <url>')
  .description('Get video details by URL or slug')
  .action(async (url) => {
    try {
      const video = await getVideo(url);
      console.log(chalk.green(`Title: ${video.name}`));
      console.log(`ID: ${video.id}`);
      console.log(`Description: ${video.description}`);
      console.log(`Poster: ${video.poster_url}`);
      console.log(`Cover: ${video.cover_url}`);
      console.log(`Views: ${video.views}`);
      console.log(chalk.yellow('Streams:'));
      video.streams.forEach(stream => {
        console.log(`  - ${stream.width}x${stream.height}: ${stream.size_mbs} MB - ${chalk.blue(stream.url)}`);
      });
      console.log(chalk.yellow('Tags:'));
      video.tags.forEach(tag => console.log(`  - ${tag.name}: ${chalk.blue(tag.link)}`));
      if (video.episodes && video.episodes.length) {
        console.log(chalk.yellow('Episodes:'));
        video.episodes.forEach(ep => console.log(`  - ${ep.name} (${ep.views} views) - ${chalk.blue(ep.link)}`));
      }
      // Prompt user to choose resolution and play in VLC
      if (video.streams && video.streams.length) {
        const choices = video.streams.map(s => ({
          name: `${s.width}x${s.height} (${s.size_mbs} MB)`,
          value: s.url
        }));
        const { selected } = await inquirer.prompt([{ type: 'list', name: 'selected', message: 'Choose resolution to play', choices }]);
        console.log(chalk.blue(`Launching VLC with ${selected}`));
        spawn('vlc', [selected], { stdio: 'inherit' });
      }
    } catch (err) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);