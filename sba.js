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
  if (ag?.semester === undefined) {
    ag.semester = CreateSemesterBlock(ag);
    ag.falseAssignments = []; //! For assignments that don't fit in with semester timeframe add to a different array
  }
  if (ag?.totalPoints === undefined)
    ag.totalPoints = 0; 
  
  FilterAssignments(ag);
  
 
  //* Find all the learners in the course
  let studentIDs = getLearnerIds([], submissions);
  let students = []; //array of the students //![{},...]


  for (let id of studentIDs) {
    // All the students in the course
    let submittedAssignments = GroupStudentAssignment(id, submissions, ag);
    let weightedAvg = 0;
    submittedAssignments.forEach(
      (assignment) =>
        (weightedAvg += CalculateAverage(
          assignment.grade,
          assignment.assignmentWeight
        ))
    );
    Math.floor(weightedAvg);
    let student = new Student(id, weightedAvg, [], submittedAssignments);
    Object.freeze(student); //Can modify it
    students.push(student);
  }
  //return an object from a selected format
  return FormatStudentsData(students, []);
}
const result = getLearnerData(CourseInfo, AssignmentGroup,LearnerSubmissions);
console.dir(result, {depth:null});

/**
 * 
 * @param {array} students 
 * @param {array} result  empty array

 */
// const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
// console.dir(result, { depth: null });
function FormatStudentsData(students, result) {
  students.forEach((student) => {
    let assignmentScores = student.submittedAssignments.map((assign) => ({ [assign.id]: assign.grade }));
    const formattedData = {
      id: student.id,
      avg: student.weightedAvg,
      assignments: assignmentScores,
    };
    result.push(formattedData);
  });
  return result;
}

/**
 * Student Constructor
 * @param {int} id
 * @param {float} simpleAvg
 * @param {float} weightedAvg
 * @param {array} courses
 * @param {array} gradableAssignments
 */
function Student(id, weightedAvg, courses, gradableAssignments) {
  (this.id = id),
    (this.weightedAvg = weightedAvg),
    (this.courses = courses),
    (this.submittedAssignments = gradableAssignments);
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
 * @param {array} ag - all the assignments for the course
 * @param {integer} id - Student Id
 * @returns [{},...] That represents the all student's submitted assignments
 */
function GroupStudentAssignment(id, submissions, ag) {
 
  //* Assign let to an array that was sorted
  let coursework = ag.assignments; 
  //* Returning an array that only has submitted assignments of one student
  let submissionsByLearner = submissions.filter((submission) =>
     submission.learner_id == id); 
  
  let result = [];
  //* loop through learner submissions for one student and find the submission that matches the assignment group id
  for (let sub of submissionsByLearner) {
    let assignmentDetails = coursework.find(function(assignment) {
      //! what do I do if I have a submitted assignment but the assignmet was removed from the array try catch
      if (assignment.id === sub.assignment_id) {
        return true;
      } else return false;
    });
    //  console.log(typeof(assignmentDetails));
    if (assignmentDetails == undefined) continue;

    let obj = {};
    Object.assign(obj, assignmentDetails, sub.submission);
    gradeAssignment(obj, ag.totalPoints, id);
    Object.freeze(obj); //*obj is not unmutable;
    result.push(obj);
  }
  //console.log(result);
  return result;
}


/*---------Course Handling---------*/
/**
 * @returns {array}  that will include the start and end of the the semester
 */
function CreateSemesterBlock(ag) {
  const semesterStart = new Date(2023, 0, 15); 
  let semesterEnd = new Date(2022, 4, 27); 
  //!Date if the semester end is somehow less then the start date the we will assign eight months
  if(semesterEnd <= semesterStart)
    {
      semesterEnd = new Date(semesterStart);
      semesterEnd.setMonth(semesterEnd.getMonth() + 8);
    }
  const semesterTimeFrame = [semesterStart, semesterEnd];
  return semesterTimeFrame;
}

/**
 * Goal: Is the due date valid?
 * @param {array} semesterBlock
 * @param {string} due_date -
 * @returns bool true or false
 */
function IsWithinSemester(semesterBlock, due_date) {
  try {
    //!Try catch here with invalid date
    valid_date = new Date(due_date);
    if (isNaN(valid_date.getTime()))
      //! Make this work
      throw new Error("The course due date is invalid");

    return semesterBlock[0] <= valid_date && valid_date <= semesterBlock[1]
      ? true // Dont need this
      : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * Goal: Modify the assingment goup 
 * @param {object} ag = Assignment Group 
 */
function FilterAssignments(ag){
   // Because we are going to be modifying the original array with splice we can count backwards to avoid index shifting.
   let assignments = ag.assignments;
   for (let i = assignments.length - 1; i >= 0; i--) { //! Could I use reduce right here
     IsWithinSemester(ag.semester, assignments[i].due_at);
     if (!IsWithinSemester(ag.semester, assignments[i].due_at)) {
       let invalidAssignment = assignments.splice(i, 1);
       ag.falseAssignments.push(invalidAssignment);
       continue;
     }
     //null coalescing we check the left hand side (x ??) to see if the value is not null or
     //undefined the we assign it. The right hand side is a fallback assignment if the left hand side 
     //returns true
    //  assignments[i].weight = assignments[i].weight ?? 0; 
     ag.totalPoints += assignments[i].points_possible;
   }
   assignments = SortAssignments(ag.assignments);
  
}

function SortAssignments(array){
  array.sort(function (a, b) {
    if (a.id < b.id)
      return -1; //A negative value indicates that a should come before b.
    else if (a.id > b.id) 
      return 1; //A positive value indicates that a should come after b.
    return 0; //Zero or NaN indicates that a and b are considered equal -> stay the same
  });
  return array;
}

//!-----------Calculations-----------------//
/** 
 * @param {Object} n - the first assignment of the student
 * @param {Number} courseTotal  - The total points of the course
 * @returns
 */
function gradeAssignment(n, courseTotal, id) {
  //! possible points cannot equal 0
  let percentageReduction = 0;
  let validDivision = true;

  try {
    validDivision = n.points_possible !== 0;
    if (!validDivision)
      throw new Error(
        `The total points for the assignment: ${n.name}, cannot be 0.`
      );

    if (new Date(n.submitted_at) > new Date(n.due_at)) {
      percentageReduction = n.score * 0.1;
      throw new Error(
        `The assignement: ${
          n.name
        } is past due for student: ${id}, deducting 10% from grade ${
          n.score / n.points_possible
        }`
      );
    }
  } catch (error) {
    if (validDivision === false) {
      n.points_possible = NaN;
      error.message += ` Assigning points_possible to NaN`;
      console.error(error.message);
      return; // exit the loop early while still printing the result
    }
    console.error(error.message);
  } finally {
    n.grade = (n.score - percentageReduction) / n.points_possible;
    n.assignmentWeight = n.points_possible / courseTotal;
  }
}

//calulate aveage
function CalculateAverage(grade, weight) {
  return grade * weight;
}
