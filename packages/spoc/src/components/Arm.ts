import { Servo } from 'johnny-five'
import { Connector } from '@spoc/connector'

export default (servos: [Servo, Servo, Servo]) => {
  return (connector: Connector) => {}
}
