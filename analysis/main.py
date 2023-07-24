#!/usr/bin/env python3

import click
import os
import json
import matplotlib.pyplot as plt

plt.rcParams['text.color'] = "#666"
plt.rcParams['axes.labelcolor'] = "#666"
plt.rcParams['xtick.color'] = "#666"
plt.rcParams['ytick.color'] = "#666"

'''
python main.py --src=./scores --ymax 100000
'''

@click.command()
@click.option('--src', help='path of folder', required=True, metavar=os.path)
@click.option('--ymax', help='max value to set for y', required=False, default =10**5, metavar=os.path)
def plot(
   src : str,
   ymax: int
   ) -> None:

   if not os.path.isdir(src):
      print("Please enter a folder")
      exit()

   for file in os.listdir(src):
      with open(os.path.join(src, file), 'rb') as f:
         content = json.load(f)

         scores = [point[1] for run in content for point in run ]
         times = [point[0] for run in content for point in run ]

         #plt.title(file)

         fig = plt.figure(facecolor='#111111')
         ax = plt.gca()
         ax.set_facecolor("#111111")
         ax.spines['bottom'].set_color('#666')
         ax.spines['top'].set_color('none')
         ax.spines['right'].set_color('none')
         ax.spines['left'].set_color('#666')

         plt.scatter(scores, times, marker='.', color="#fff")
         ax.set_ylim(0.1, ymax)
         ax.set_yscale("log")
         
         plt.xlabel('time [ms]')
         plt.ylabel('cost')

         plt.savefig(f"plots/{file}.png", dpi=600)
         
         #  clean plot
         plt.clf()












if __name__ == "__main__":
   plot()