import { Accelerometer, Board, Led, Motors, Proximity } from 'johnny-five'
// import robot from './robot'
import Redis from 'ioredis'
// import { Channel, RedisConnector } from '@spoc/connector'
import { EventEmitter } from 'events'
// const board = new Board()
// const connector = new RedisConnector(
//   new Redis(),
//   new Redis(),
//   new EventEmitter()
// )
//
// const channel = connector.channel('foo')
//
// channel.subscribe((d) => {
//   console.log(d)
// })

// setInterval(() => {}, 100)

const MAX_SENSOR_DISTANCE = 50
const THRESHOLD = 5
const MAX_MOTOR_SPEED = 180

// const deltaDistance = MAX_SENSOR_DISTANCE - MIN_SENSOR_DISTANCE
// const deltaSpeed = MAX_MOTOR_SPEED - MIN_MOTOR_SPEED
//
// const SPEED_RATIO = MAX_MOTOR_SPEED / MAX_SENSOR_DISTANCE

const findSpeed = (distance: number, desire: number) => {
  const delta = distance - desire

  const deltaValue = Math.abs(delta)

  if (delta > MAX_SENSOR_DISTANCE || deltaValue < THRESHOLD) {
    return 0
  }

  return Math.sign(delta) * 100
}

const board = new Board()

board.on('ready', () => {
  const accelerometer = new Accelerometer({
    controller: 'ADXL345',
    // @ts-ignore
    // Optionally set the range to one of
    // 2, 4, 8, 16 (±g)
    // Defaults to ±2g
    // range: ...
  })

  accelerometer.on('change', () => {
    const {
      acceleration,
      inclination,
      orientation,
      pitch,
      roll,
      x,
      y,
      z,
    } = accelerometer
    console.log('Accelerometer:')
    console.log('  x            : ', x)
    console.log('  y            : ', y)
    console.log('  z            : ', z)
    console.log('  pitch        : ', pitch)
    console.log('  roll         : ', roll)
    console.log('  acceleration : ', acceleration)
    console.log('  inclinationxxxx  : ', inclination)
    console.log('  orientation  : ', orientation)
    console.log('--------------------------------------')
  })

  const motors = new Motors([
    { pins: { pwm: 9, dir: 7, cdir: 8 } },
    { pins: { pwm: 11, dir: 12, cdir: 10 } },
  ])

  const led1 = new Led(3)
  const led2 = new Led(2)
  //

  const leftFrontSensor = new Proximity({
    controller: '2Y0A21',
    pin: 'A1',
  })

  const groundSensor = new Proximity({
    controller: '2Y0A21',
    pin: 'A2',
  })

  const rightFrontSensor = new Proximity({
    controller: '2Y0A21',
    pin: 'A3',
  })

  const leftRearSensor = new Proximity({
    controller: '2Y0A21',
    pin: 'A6',
  })

  const rightRearSensor = new Proximity({
    controller: '2Y0A21',
    pin: 'A7',
  })
  //
  // const backSensor = new Proximity({
  //   controller: '2Y0A21',
  //   pin: 'A2',
  // })
  //

  //
  // // backSensor.on('data', ({ cm }) => {
  // //   // console.log(`sensor2: `, cm)
  // // })
  //
  //
  // // motors.forward(255)
  //
  board.repl.inject({
    motors,
    led1,
    led2,
  })
})
