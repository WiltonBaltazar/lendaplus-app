import Link from "next/link"

function Footer() {
  return (
    <div className='max-w-[500px]  my-10 mx-auto flex flex-row justify-center gap-4 px-[20px]'>
      <Link href="#" className="underline text-xs">Termos e condições</Link>
      <Link href="#" className="underline text-xs">Política de privacidade</Link>
    </div>
  )
}

export default Footer