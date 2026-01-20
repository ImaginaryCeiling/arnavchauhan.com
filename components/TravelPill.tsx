interface TravelPillProps {
  destination: string
  dateRange?: string
}

const TravelPill = ({ destination, dateRange }: TravelPillProps) => {
  return (
    <div className="inline-flex items-center rounded-full border border-emerald-400 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 dark:border-emerald-500 dark:bg-gray-800 dark:text-gray-100">
      <span className="mr-2">📍</span>
      <span>
        Next: <span className="font-semibold">{destination}</span>
        {dateRange && <span className="ml-1 text-gray-500 dark:text-gray-400">({dateRange})</span>}
      </span>
    </div>
  )
}

export default TravelPill
