const Header = (props) => {
  return (
    <div>
    <h2>{props.course.name}</h2>
    </div>
  )
}

const Part = (props) => {
  return (
    <p>
    {props.p} {props.e}
    </p>
  )
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map(part => (
        <Part key={part.id} p={part.name} e={part.exercises}/>
      ))}
       <Total parts={props.parts}/>
    </div>
  );
};


const Total = (props) => {
  return(
    <p>
      Total: {props.parts.reduce( (s, p) => s+p.exercises, 0, )}
    </p>
  )
}

const Course = (props) => {
  return (
    <div>
      <Header course={props.course}/>
      <Content parts={props.course.parts}/>
    </div>
  )
}

export default Course