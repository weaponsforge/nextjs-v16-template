interface RibbonCardProps {
  label?: string;
  title: string;
  description: string;
}

export default function RibbonCard(props: RibbonCardProps) {
  const { label = 'FEATURED', title, description } = props

  return (
    <div className="relative min-w-32 max-w-80 min-h-18 p-4 bg-white shadow-lg rounded-xl overflow-hidden">

      {/* Ribbon */}
      <div className="absolute top-4 -left-6 -rotate-45">
        <div className="relative bg-blue-600 text-white text-xs font-bold px-6 py-1 shadow-md">
          {label}

          {/* Ribbon tail */}
          <div className="absolute left-0 bottom-0 w-0 h-0 border-l-10 border-l-transparent border-t-10 border-t-blue-800" />
          <div className="absolute right-0 bottom-0 w-0 h-0 border-r-10 border-r-transparent border-t-10 border-t-blue-800" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <p className="text-gray-500 font-normal text-lg">
          {description}
        </p>
      </div>
    </div>
  )
}
