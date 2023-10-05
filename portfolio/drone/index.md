# Drone
<video width="320" autoplay loop muted playsinline>
    <source src="assets/preview.mp4" type="video/mp4" />
    Your browser does not support the video tag.
</video>

## I Know Nothing about Quadcopters
This project started my freshman year when I proposed to build a drone for my embedded systems final project. The professor quickly shut that idea down because it was "over-ambitious" but I pursued the project on my own anyways. So here we are!

## The Frame
I learned to CAD through this project. I used [Shapr3D](https://www.shapr3d.com/) and the [Prusa i3 Mk3](https://www.prusa3d.com/category/original-prusa-i3-mk3s/) to build the frame of the drone.

## Electronics
Powering four motors seemed pretty straight forward, but I had a lot to learn in doing this efficiently and without risking other parts of my circuit. So at a glance I'm using a MOSFET for each motor with its gate connected to a PWM pin on the microcontroller. And for that I'm using the [XIAO RP2040](https://www.seeedstudio.com/XIAO-RP2040-v1-0-p-5026.html) due to its convenient form factor.

The on-board sensor is the [MPU6050](https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/) which is quite dated but its [Digital Motion Processor (DMP)](https://mjwhite8119.github.io/Robots/mpu6050) gives good-enough results.

The motors and battery all operate at 3.7V.

## R.I.P.
Again, I made this freshman year. So my only option for making things "permanent" was through a [perfboard](https://en.wikipedia.org/wiki/Perfboard) which is generally a bad idea for this scale of a circuit. Nevertheless, it worked and I was able to operate and modulate the speed of each motor one/all at a time. But the first test flight (when I was still writing the flight controller) crashed and smushed all electronic components sticking out... then every subsequent test short-circuited the battery and started smoking.

## The Future..?
Two years later, I'm taking How to Make Almost Anything and it so happens that we'll be learning PCB design. So I'll be making v2 of this project and updating progress at [my blog there](https://fab.cba.mit.edu/classes/863.23/EECS/people/Yohan/) first!