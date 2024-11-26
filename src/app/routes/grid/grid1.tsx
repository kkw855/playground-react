export const Grid1Route = () => {
  return (
    <section className="m-4">
      <div className="grid grid-flow-row auto-rows-[100px] grid-cols-[100px_100px_100px_100px_100px_100px] grid-rows-[100px_100px_100px_100px_100px_100px]">
        <div className="col-[1/5] row-[1/3]">1</div>
        <div className="col-span-2 row-span-2">2</div>
        <div className="col-[1/-1] row-[3/-1]">3</div>
        <div>4</div>
      </div>
    </section>
  )
}
