
const Header = (props) => {
  
    return (
      <h3>
        {props.course.name}
      </h3>
    )
  }
  
  const Part = (props) => {
    console.log('Part props:', props)
  
    return (
      <p>
        {props.name} {props.exercises}
      </p>
    )
  }
  
  const Content = (props) => {
    console.log('Content props:', props)
  
   return (
      <>
        {props.parts.map(part =>
          <Part key={part.id} name={part.name} exercises={part.exercises} />)}
      </>
    )
  }
  
  const Total = (props) => {
    console.log('Total props:', props)
  
    return (
        <p>
          <b>
            total of {props.parts.map(part => 
                        part.exercises).reduce((a, b) =>
                          a + b, 0)} exercises
          </b>
        </p>
    )
  }
const Course = (props) => {
    console.log('Course props:', props)
    
    return (
      <>
        <Header course={props.course}  />
        <Content parts={props.course.parts} />
        <Total parts={props.course.parts} />
      </>
    )
  }

export default Course
