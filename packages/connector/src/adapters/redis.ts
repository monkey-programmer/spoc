import { Channel, ChannelSubscriber } from '../Channel'
import { Redis } from 'ioredis'

export class RedisChannel<T> implements Channel<T> {
  constructor(
    private readonly pub: Redis,
    private readonly sub: Redis,
    private readonly name: string
  ) {
    this.sub.subscribe(this.name).catch((e) => console.error(e))
  }

  public publish(message: T): void {
    this.pub
      .publish(this.name, JSON.stringify(message))
      .catch((e) => console.error(e))
  }

  public subscribe(callback: ChannelSubscriber<T>): void {
    this.sub.on('message', (channel, message) => {
      if (channel === this.name) {
        callback(JSON.parse(message))
      }
    })
  }
}

export default (pub: Redis, sub: Redis) => {
  return {
    channel<T>(name: string): Channel<T> {
      return new RedisChannel<T>(pub, sub, name)
    },
  }
}
