import { Led } from 'johnny-five'
import { Connector } from '@spoc/connector'
import { COMMAND_LIGHT } from '../channels'

export default ({ left, right }: { left: Led; right: Led }) => {
  return (connector: Connector) => {
    const channel = connector.channel<boolean>(COMMAND_LIGHT)

    channel.subscribe((shouldOn) => {
      if (shouldOn) {
        left.on()
        right.on()
      } else {
        left.off()
        right.off()
      }
    })
  }
}
