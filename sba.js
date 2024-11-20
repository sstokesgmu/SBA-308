// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
  {
    learner_id: 453,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(course, ag, submissions) {
  let getData = [];
  const result = [
    //   {
    //     id: 125,
    //     avg: 0.985, // (47 + 150) / (50 + 150)
    //     1: 0.94, // 47 / 50
    //     2: 1.0 // 150 / 150
    //   },
    //   {
    //     id: 132,
    //     avg: 0.82, // (39 + 125) / (50 + 150)
    //     1: 0.78, // 39 / 50
    //     2: 0.833 // late: (140 - 15) / 150
    //   }
  ];

  // here, we would process this data to achieve the desired result.
  // console.log(submissions);

  //Which learner are we talking about
  let studentIDs = getLearnerIds(getData,submissions);
  //console.log(studentIDs);
  //Calculate the weighted average for each student

  let studentScores = [];
  
  for(let submission of submissions){
    let id = 125;//!hard coded
    if(submission.learner_id == id)
    {
      let assignment = {
        learner_id: id,
        assignment_id: submission.assignment_id,
        weighted_grade: 0        
      }
      Object.assign(assignment, submission.submission); //copies properties from one object to another in this case we get the LearnerSubmission submission object(the internal object)
      studentScores.push(assignment);
    }
  }

  console.log(studentScores); //multidimensional array [{}]  SubmittedAssignments based on learner
  //?Can we put into a function
  for(let i = 0, assign = ag.assignments; i < studentScores.length; i++){
    totalPossiblePoints = 700 //!hard coded can we pass the total 
    studentScores.forEach((assignment) => {
       if(assignment.assignment_id == assign[i].id){
        let simpleAvg =  assignment.score / assign[i].points_possible; // grades with no weigth
        let weight = assign[i].points_possible / totalPossiblePoints; // weight an assignment holds
        assignment.weighted_grade = Math.trunc((simpleAvg * weight)*100); // the individual grade (weigthed) as a whole number
        //The Math.trunc() static method returns the integer part of a number by removing any fractional digits. //!rounds down
      }
    })
}

  
weightedavg = studentScores.reduce(function(sum, element){ //method returns a single value: the function's accumulated result based on the equation below
  return sum + element.weighted_grade;
},0);
console.log(weightedavg); 







  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

function getLearnerIds(resultArray, learnerSubmissions) {
  for(let submission of learnerSubmissions)
  {
     //is the id is not in the array already? true add it
    if(!resultArray.includes(submission.learner_id))
      resultArray.push(submission.learner_id)
  }
  return resultArray; //Return the array of all the students in the course
}

//console.log(result);
