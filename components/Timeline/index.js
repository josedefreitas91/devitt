import Link from 'next/link'

const Timeline = ({ userName }) => {
  return (
    <>
      <section>
        <h1>Timeline of {userName}</h1>

        <Link href="/">
          <a>Go home</a>
        </Link>
      </section>
    </>
  )
}

export default Timeline

Timeline.getInitialProps = () => {
  // return { userName: 'Jose' }
  return fetch('http://localhost:3000/api/hello')
    .then(res => res.json())
    .then(response => {
      console.log(response)
      return response
    })
}
