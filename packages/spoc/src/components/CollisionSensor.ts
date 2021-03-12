import { Proximity, ProximityData } from 'johnny-five'
import { Connector } from '@spoc/connector'
import { SENSOR_OBSTACLE_FRONT, SENSOR_OBSTACLE_REAR } from '../channels'

export default ({ front, rear }: { front: Proximity; rear: Proximity }) => {
  return (connector: Connector) => {
    ;[
      { sensor: front, channel: SENSOR_OBSTACLE_FRONT },
      { sensor: rear, channel: SENSOR_OBSTACLE_REAR },
    ].forEach(({ sensor, channel: channelName }) => {
      const channel = connector.channel<ProximityData>(channelName)

      // let sensorData: ProximityData

      // sensor.on('data', (data) => {
      //   console.log(channelName, data.cm)
      //   // channel.publish(data)
      //   // console.log(data.cm)
      // })

      setInterval(() => {
        // if (sensorData) {
        channel.publish({
          cm: Math.random(),
          in: Math.random(),
        })
        // console.log(sensorData)
        // }
      }, 500)
    })
  }
}
