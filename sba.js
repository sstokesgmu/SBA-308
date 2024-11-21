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
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
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


  //Which learner are we talking about
  let studentIDs = getLearnerIds(getData,submissions);
  let students = []; //array of the students class

  for(let id of studentIDs) // All the students in the course
  {
    let submittedAssignments = getSubmissionForStudent(submissions,ag, id);
    // console.log(submittedAssignments);
    // console.log(`found all of student: ${id} comepleted assignments`);
    // let assignment = {};
    // Object.assign(assignment, submittedAssignments.submission);
    // Object.assign(assignment, ag.submission); //copies properties from one object to another in this case we get the LearnerSubmission submission object(the internal object)
    //studentScores.push(assignment);
    let student = new Student(id,0,0,[],submittedAssignments)
    students.push(student);
  }

  //console.log(students[0].submittedAssignments);
}
//     //Calculate the weighted average for each student
//   for(let submission of submissions){
//     let id = 125;//!hard coded
//     if(submission.learner_id == id)
//     {
//       let assignment = {
//         learner_id: id,
//         assignment_id: submission.assignment_id,
//         weighted_grade: 0        
//       }
//       Object.assign(assignment, submission.submission); //copies properties from one object to another in this case we get the LearnerSubmission submission object(the internal object)
//       studentScores.push(assignment);
//     }
//   }

//   console.log(studentScores); //multidimensional array [{}]  SubmittedAssignments based on learner
//   //?Can we put into a function
//   for(let i = 0, assign = ag.assignments; i < studentScores.length; i++){
//     totalPossiblePoints = 700 //!hard coded can we pass the total 
//     studentScores.forEach((assignment) => {
//        if(assignment.assignment_id == assign[i].id){
//         let simpleAvg =  assignment.score / assign[i].points_possible; // grades with no weigth
//         let weight = assign[i].points_possible / totalPossiblePoints; // weight an assignment holds
//         assignment.weighted_grade = Math.trunc((simpleAvg * weight)*100); // the individual grade (weigthed) as a whole number
//         //The Math.trunc() static method returns the integer part of a number by removing any fractional digits. //!rounds down
//       }
//     })
// }

  
// weightedavg = studentScores.reduce(function(sum, element){ //method returns a single value: the function's accumulated result based on the equation below
//   return sum + element.weighted_grade;
// },0);
// console.log(weightedavg); 



const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);


/**
 * 
 * @param {int} id 
 * @param {float} simpleAvg  
 * @param {float} weightedAvg 
 * @param {array} courses 
 * @param {array} submittedAssignments 
 */
function Student(id, simpleAvg, weightedAvg, courses, submittedAssignments )
{
  this.id = id, 
  this.simpleAvg = simpleAvg, 
  this.weightedAvg = weightedAvg, 
  this.courses = courses,
  this.submittedAssignments =submittedAssignments;
}




function getLearnerIds(resultArray, learnerSubmissions) {
  for(let submission of learnerSubmissions)
  {
     //is the id is not in the array already? true add it
    if(!resultArray.includes(submission.learner_id))
      resultArray.push(submission.learner_id)
  }
  return resultArray; //Return the array of all the students in the course
}

/**
 * 
 * @param {array} submissions - Total submissions by the student
 * @param {array} assignmentGroup - all the assignments for the course 
 * @param {integer} id - Student Id 
 * @returns [{},...] That represents the all student's submitted assignments
 */
function getSubmissionForStudent(submissions, assignmentGroup, id){
  assignmentGroup.assignments.sort(function(a,b){
    if(a.id < b.id)
      return -1; //A negative value indicates that a should come before b.
    else if(a.id > b.id)
      return 1;  //A positive value indicates that a should come after b.
    return  0; //Zero or NaN indicates that a and b are considered equal -> stay the same
  });
  let coursework = assignmentGroup.assignments;
  let learnerSubmissions = submissions.filter((submission) => submission.learner_id == id);
  let result = [];
  //loop through learner submissions
  for(let sub of learnerSubmissions)
  {
    let assignmentDetails = coursework.find((assignment) => assignment.id === sub.assignment_id)
    if(assignmentDetails === undefined) // Somehow the learner submitted a assignment that was not in the coursework
      continue;
    let obj = {};
    Object.assign(obj,assignmentDetails,sub.submission);
    result.push(obj);
  }
  return result;
}


