import React from 'react'

const Header = ({website}) => {
    const {title} = website
  return (
    <div 
    className="h-14 px-4 flex item-center justify-between border-b border-white/10"
    >
        <span>{title}</span>

    </div>
  )
}

export default Header