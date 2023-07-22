import click
import os
import json
import matplotlib.pyplot as plt


'''
python main.py --src=../scores --ymax 100000
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

         fig = plt.figure()
         ax = plt.gca()

         plt.scatter(scores, times, marker='x')
         ax.set_ylim(0.1, ymax)
         ax.set_yscale("log")
         
         plt.xlabel('time / ms')
         plt.ylabel('cost')

         plt.savefig(file+".png")
         
         #  clean plot
         plt.clf()












if __name__ == "__main__":
   plot()