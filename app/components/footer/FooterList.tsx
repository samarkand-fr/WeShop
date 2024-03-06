interface FooterLListProps{
    children:React.ReactNode
}
// the list of footer items(4 list cols)
const FooterList:React.FC<FooterLListProps> = ({children}) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-6 flex flex-col gap-2 ">
    {children}
    </div>
  )
}

export default FooterList