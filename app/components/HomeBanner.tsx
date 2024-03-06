import Image from "next/image"

const HomeBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-pink-500 to-pink-300 mb-8">
        <div className="mx-auto px-8 py-12 flex flex-col gap-2 md:flex-row items-center justify-evenly">
           <div className="mb-8 md:mb-0 text-center">
            <p className="text-4xl md:text-6xl font-bold text-white mb-4">Cutting-Edge Tech</p>
            <p className="text-lg md:text-xl text-white mb-2"> Discover the Latest Gadgets</p>
            <p className="text-2xl md:text-5xl text-yellow-400 font-bold">Gear Up for Fun</p>
           </div>
           <div className="relative w-1/3 aspect-video">
            <Image  src="/image-banner.png"
                     fill
                     alt="banner-image"
                     className="object-contain"/>
            </div> 
        </div>
    </div>
  )
}

export default HomeBanner