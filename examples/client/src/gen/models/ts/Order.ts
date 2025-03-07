export const OrderStatus = {
  'placed': 'placed',
  'approved': 'approved',
  'delivered': 'delivered',
} as const
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]
export const OrderHttpStatus = {
  'ok': 200,
  'not_found': 400,
} as const
export type OrderHttpStatus = (typeof OrderHttpStatus)[keyof typeof OrderHttpStatus]
export type Order = {
  /**
   * @type integer | undefined int64
   * @example 10
   */
  id?: number
  /**
   * @type integer | undefined int64
   * @example 198772
   */
  petId?: number
  /**
   * @type integer | undefined int32
   * @example 7
   */
  quantity?: number
  /**
   * @type string | undefined date-time
   */
  shipDate?: Date
  /**
   * @description Order Status
   * @type string | undefined
   * @example approved
   */
  status?: OrderStatus
  /**
   * @description HTTP Status
   * @type number | undefined
   * @example 200
   */
  http_status?: OrderHttpStatus
  /**
   * @type boolean | undefined
   */
  complete?: boolean
}
