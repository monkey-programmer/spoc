export type ChannelSubscriber<Message> = (message: Message) => void

export interface Channel<Message> {
  publish(message: Message): void
  subscribe(callback: ChannelSubscriber<Message>): void
}
