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
      {
        id: 125,
        avg: 0.985, // (47 + 150) / (50 + 150)
        1: 0.94, // 47 / 50
        2: 1.0 // 150 / 150
      },
      {
        id: 132,
        avg: 0.82, // (39 + 125) / (50 + 150)
        1: 0.78, // 39 / 50
        2: 0.833 // late: (140 - 15) / 150
      }
  ];
  ag.semester = CreateSemesterBlock(ag);
  ag.falseAssignments = []; //! For assignments that don't fit in with semester timeframe add to a different array
  ag.totalPoints = 0; 
  // Because we are going to be modifying the original array with splice we can count backwards to avoid index shifting.
  for (let i = ag.assignments.length; i > 0;  i--) {
    IsWithinSemester(ag.semester, ag.assignments[i - 1].due_at);
    // console.log(`Is ${ag.assignments[i].due_at} within the semester ${IsWithinSemester(ag.semester, ag.assignments[i].due_at)!= true}`)
    if(!IsWithinSemester(ag.semester, ag.assignments[i - 1].due_at)){
      let deprecatedObj = ag.assignments.splice(i-1, 1);
      ag.falseAssignments.push(deprecatedObj);
      continue;
    }
   ag.totalPoints += ag.assignments[i-1].points_possible;
  }

  //? Which learner are we talking about
  let studentIDs = getLearnerIds(getData, submissions);
 // console.log(studentIDs);
  let students = []; //array of the students class

  for (let id of studentIDs) { // All the students in the course
    let submittedAssignments = getSubmissionForStudent(id, submissions, ag);
    let student = new Student(id, 0, 0, [], submittedAssignments);

    // console.log(submittedAssignments);
    // console.log(`found all of student: ${id} comepleted assignments`);
    // let assignment = {};
    // Object.assign(assignment, submittedAssignments.submission);
    // Object.assign(assignment, ag.submission); //copies properties from one object to another in this case we get the LearnerSubmission submission object(the internal object)
    //studentScores.push(assignment);
    students.push(student);
  }
 //console.log(students);
  //console.log(students[0].submittedAssignments);
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

/**
 * Student Constructor
 * @param {int} id
 * @param {float} simpleAvg
 * @param {float} weightedAvg
 * @param {array} courses
 * @param {array} submittedAssignments
 */
function Student(id, simpleAvg, weightedAvg, courses, submittedAssignments) {
  (this.id = id),
    (this.simpleAvg = simpleAvg),
    (this.weightedAvg = weightedAvg),
    (this.courses = courses),
    (this.submittedAssignments = submittedAssignments);
}
/**
 * getLearnerIds
 * @param {Array} result
 * @param {Array} learnerSubmissions
 * @returns //Return the array of all the students in the course
 */
function getLearnerIds(result, learnerSubmissions) {
  for (let submission of learnerSubmissions)
    if (!result.includes(submission.learner_id))
      //is the id is not in the array already? true add it
      result.push(submission.learner_id);
  return result;
}
/**
 *
 * @param {array} submissions - Total submissions by the student
 * @param {array} assignmentGroup - all the assignments for the course
 * @param {integer} id - Student Id
 * @returns [{},...] That represents the all student's submitted assignments
 */
function getSubmissionForStudent(id, submissions, assignmentGroup) {
  assignmentGroup.assignments.sort(function (a, b) {
    if (a.id < b.id)
      return -1; //A negative value indicates that a should come before b.
    else if (a.id > b.id) return 1; //A positive value indicates that a should come after b.
    return 0; //Zero or NaN indicates that a and b are considered equal -> stay the same
  });




  let coursework = assignmentGroup.assignments; //* Assign let to an array that was sorted
  let submissionByLearner = submissions.filter(
    (submission) => submission.learner_id == id
  ); //* Returning an array that only has submitted assignments of one student
  let result = [];
  //* loop through learner submissions compare 
  for (let sub of submissionByLearner) { 
    let assignmentDetails = coursework.find((assignment) => assignment.id === sub.assignment_id);
    console.log(assignmentDetails);

    
    let obj = {};
    if (assignmentDetails === undefined)
      // Somehow the learner submitted a assignment that was not in the coursework
      continue;
    //*Find the assignment where it's id matches the id of the student's submission 
    
    Object.assign(obj, assignmentDetails, sub.submission);
    result.push(obj);
  }
  return result;
}

function CalculateCumulativePoints(...points) {}

/**
 * @returns //An array that include the start and end of the the semester
 */
function CreateSemesterBlock(ag) {
  const semesterStart = new Date(2023, 0, 15);
  const semsterEnd = new Date(2023, 4, 27); //!Date cannot be less than the start
  const semsterTimeFrame = [semesterStart, semsterEnd];
  return semsterTimeFrame;
}

/**
 * Goal: Is the due date valid?
 * @param {array} semesterBlock 
 * @param {string} due_date - 
 * @returns bool true or false
 */
function IsWithinSemester(semesterBlock, due_date) {
  try{
    //!Try catch here with invalid date
     valid_date = new Date(due_date);
     if(isNaN(valid_date.getTime()))
      throw new Error("The course due date is invalid");

     return semesterBlock[0] <= valid_date &&
     valid_date <= semesterBlock[1]
     ? true
     : false;     
  }
  catch(error)
  {
      console.log(error)
      return false;
  }
}
