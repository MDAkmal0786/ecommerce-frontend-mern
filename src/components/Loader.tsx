
 /// loader --> suspense wala till file load 
 //             another is skekelton for a component that need data fetching
export const Loader = () => {
  return (
    <div className="loader-box">

      <main className="loader">

      </main>

    </div>
  )
}
export const Skeleton = ()=>{
  return (
    <div className="skeleton-box">

      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>

    </div>
  )
}
