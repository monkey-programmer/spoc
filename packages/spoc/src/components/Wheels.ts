import { Motor, ProximityData } from 'johnny-five'
import { Connector, observe } from '@spoc/connector'
import {
  COMMAND_NAVIGATION,
  SENSOR_OBSTACLE_FRONT,
  SENSOR_OBSTACLE_REAR,
} from '../channels'
import { Velocity } from '../messages'

type WheelsWiring = {
  left: Motor
  right: Motor
}

type WheelsSpeedConverter = (speed: number, inputVoltage: number) => number

type WheelsCharacteristic = {
  MEAN_WHEEL_SHAFT_LENGTH: number
  LEFT_WHEEL_SPEED_TO_PWM: WheelsSpeedConverter
  RIGHT_WHEEL_SPEED_TO_PWM: WheelsSpeedConverter
}

const VelocityZero: Velocity = {
  angular: 0,
  linear: 0,
}

const ObstacleNone: ProximityData = {
  cm: 99999,
  in: 99999,
}

const HIT_WARNING_LEVEL = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
}

function estimateHitWarningLevel(
  velocity: Velocity,
  frontObstacle: number,
  rearObstacle: number
): number {
  if (frontObstacle < 7) {
    return HIT_WARNING_LEVEL.HIGH
  }

  return 1
}

function estimateWheelSpeed(
  shaftLength: number,
  velocity: Velocity
): [number, number] {
  return [20, 20]
}

export default (
  { left, right }: WheelsWiring,
  {
    MEAN_WHEEL_SHAFT_LENGTH,
    LEFT_WHEEL_SPEED_TO_PWM,
    RIGHT_WHEEL_SPEED_TO_PWM,
  }: WheelsCharacteristic
) => {
  return (connector: Connector) => {
    observe(
      connector.channels([
        COMMAND_NAVIGATION,
        SENSOR_OBSTACLE_FRONT,
        SENSOR_OBSTACLE_REAR,
      ]),
      (
        velocity: Velocity,
        { cm: front }: ProximityData,
        { cm: rear }: ProximityData
      ) => {
        if (
          estimateHitWarningLevel(velocity, front, rear) >
          HIT_WARNING_LEVEL.HIGH
        ) {
          left.stop()
          right.stop()
          return
        }

        const [leftSpeed, rightSpeed] = estimateWheelSpeed(
          MEAN_WHEEL_SHAFT_LENGTH,
          velocity
        )
        const executionMatrix: [Motor, number, WheelsSpeedConverter][] = [
          [left, leftSpeed, LEFT_WHEEL_SPEED_TO_PWM],
          [right, rightSpeed, RIGHT_WHEEL_SPEED_TO_PWM],
        ]

        executionMatrix.forEach(([motor, speed, pwmConverter]) => {
          const pwm = pwmConverter(Math.abs(speed), 12)
          speed > 0 ? motor.forward(pwm) : motor.reverse(pwm)
        })

        return
      },
      [VelocityZero, ObstacleNone, ObstacleNone]
    )
  }
}
