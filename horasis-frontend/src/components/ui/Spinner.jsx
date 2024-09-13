// import { Oval } from "react-loader-spinner"

const Spinner = ({size='6'}) => {
  return (
    <div className="flex justify-center items-center ">
      <div
        className={`border-2 border-transparent border-t-2 border-t-system-primary-accent animate-spin rounded-full h-${size} w-${size}`}
      ></div>
      {/* <Oval
        height={20}
        width={20}
        color="#000"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="logo-loading"
        secondaryColor="#DEE0E3"
        strokeWidth={3}
        strokeWidthSecondary={3}
      /> */}
    </div>
  )
}

export default Spinner