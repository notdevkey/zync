import { Mermaid } from 'mdx-mermaid/lib/Mermaid';

export function MermaidDisplay() {
  return (
    <Mermaid
      chart={`
      classDiagram

      class Point {
        latitude: number
        longitude: number
      }

      class Contacts {
        id: string
        phone: string
        email: string
      }

      class Driver {
        id: string
        name: string
        licenseSince: DateTime
        contactsId: string
      }

      class TransportParams {
        size: number
        capacity: number
      }

      class Transport {
        id: string
        driver: Driver
        currentLocation: Point
        params: TransportParams
        orders: Order[]
      }

      class User {
        id: string
        email: string
        password: string
        orders: Order[]

        contactsId: string

      }

      class OrderStatus {
        <<enum>>
        NotVerified
        NotDispatched
        InTransit
        Delivered
      }

      class OrderParams {
        status: OrderStatus
        description: string
        baggageDimensions: number
      }

      class Route {
        waypoints: Point[]
        route: Point[]
      }

      class Order {
        id: string
        transportId: string
        route: Route
        from: Point
        to: Point
        params: OrderParams
        userId: string
      }

      Order "1..*" o-- "1" Transport
      Order "1..*" o-- "1" User
      OrderParams "1" o-- "1" Order
      Route "1" o-- "1" Order
      OrderStatus --> OrderParams
      TransportParams "1" o-- "1" Transport
      Point --> Order
      Point --> Transport
      Contacts --> Driver
      Contacts --> User
      Transport o-- Driver

      %% Data manipulation classes

      class ITransportRepository {
        <<interface>>
        +getAllTransports() Transport[]
        +getTransportByOrder(order: Order) Transport
        +getTransportById(id: string) Transport
        +getTransportByParams(params: TransportParams) Transport

        +createTransport(item: Transport) void
        +updateTransport(item: Transport, id: string) void
      }

      class TransportRepository {
        +getAllTransports() Transport[]
        +getTransportByOrder(order: Order) Transport
        +getTransportById(id: string) Transport
        +getTransportByParams(params: TransportParams) Transport

        +createTransport(item: Transport) void
        +updateTransport(item: Transport, id: string) void
      }

      ITransportRepository ..|> TransportRepository

      class IOrderRepository {
        <<interface>>
        +getAllOrdersByTransport(transportId: string) Order[]
        +getAllOrdersByUser(userId: string) Order[]
        +getOrderById(id: string) Order

        +createOrder(item: Order, transportId: string) void
        +updateOrder(item: Order, id: string) void
        +removeOrder(id: string) void
      }

      class OrderRepository {
        +getAllOrdersByTransport(transportId: string) Order[]
        +getAllOrdersByUser(userId: string) Order[]
        +getOrderById(id: string) Order

        +createOrder(item: Order, transportId: string) void
        +updateOrder(item: Order, id: string) void
        +removeOrder(id: string) void
      }

      IOrderRepository ..|> OrderRepository

      `}
    />
  );
}
