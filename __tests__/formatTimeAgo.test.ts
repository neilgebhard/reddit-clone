import { formatTimeAgo } from '../index'

describe('formatTimeAgo', () => {
  beforeAll(() => {
    // Mock the current time to make tests deterministic
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should format time as "seconds ago" for very recent dates', () => {
    const fiveSecondsAgo = new Date('2024-01-15T11:59:55Z')
    const result = formatTimeAgo(fiveSecondsAgo)
    expect(result).toBe('5 seconds ago')
  })

  it('should format time as "minutes ago" for recent dates', () => {
    const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z')
    const result = formatTimeAgo(fiveMinutesAgo)
    expect(result).toBe('5 minutes ago')
  })

  it('should format time as "hours ago" for dates within the day', () => {
    const threeHoursAgo = new Date('2024-01-15T09:00:00Z')
    const result = formatTimeAgo(threeHoursAgo)
    expect(result).toBe('3 hours ago')
  })

  it('should format time as "days ago" for dates within the week', () => {
    const threeDaysAgo = new Date('2024-01-12T12:00:00Z')
    const result = formatTimeAgo(threeDaysAgo)
    expect(result).toBe('3 days ago')
  })

  it('should format time as "weeks ago" for dates within the month', () => {
    const twoWeeksAgo = new Date('2024-01-01T12:00:00Z')
    const result = formatTimeAgo(twoWeeksAgo)
    expect(result).toBe('2 weeks ago')
  })

  it('should format time as "months ago" for dates within the year', () => {
    const threeMonthsAgo = new Date('2023-10-15T12:00:00Z')
    const result = formatTimeAgo(threeMonthsAgo)
    expect(result).toBe('3 months ago')
  })

  it('should format time as "years ago" for dates over a year old', () => {
    const twoYearsAgo = new Date('2022-01-15T12:00:00Z')
    const result = formatTimeAgo(twoYearsAgo)
    expect(result).toBe('2 years ago')
  })

  it('should handle date strings as input', () => {
    const dateString = '2024-01-15T11:55:00Z'
    const result = formatTimeAgo(dateString)
    expect(result).toBe('5 minutes ago')
  })

  it('should handle "just now" for very recent times', () => {
    const justNow = new Date('2024-01-15T11:59:59Z')
    const result = formatTimeAgo(justNow)
    expect(result).toBe('1 second ago')
  })
})
