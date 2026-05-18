// Data structures and algorithms for student management
class Student {
  constructor(id, name, className, mathScore = 0, scienceScore = 0, englishScore = 0, attendanceRate = 0) {
    this.id = id;
    this.name = name;
    this.className = className;
    this.mathScore = mathScore;
    this.scienceScore = scienceScore;
    this.englishScore = englishScore;
    this.attendanceRate = attendanceRate;
  }

  get averageScore() {
    return (this.mathScore + this.scienceScore + this.englishScore) / 3;
  }

  predictPerformance() {
    const currentAvg = this.averageScore;
    const attendanceFactor = this.attendanceRate / 100;
    
    // Advanced prediction algorithm
    let prediction = currentAvg * attendanceFactor;
    
    // Consistency bonus/penalty
    const scores = [this.mathScore, this.scienceScore, this.englishScore];
    const variance = this.calculateVariance(scores);
    
    if (variance < 100) { // Consistent performance
      prediction += 5;
    } else if (variance > 400) { // Inconsistent performance
      prediction -= 3;
    }
    
    // Attendance impact
    if (this.attendanceRate > 95) {
      prediction += 3;
    } else if (this.attendanceRate < 75) {
      prediction -= 5;
    }
    
    return Math.min(100, Math.max(0, prediction));
  }

  calculateVariance(scores) {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    return scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  }

  getRiskLevel() {
    const avgScore = this.averageScore;
    const attendance = this.attendanceRate;
    
    if (avgScore < 50 || attendance < 70) return 'High Risk';
    if (avgScore < 70 || attendance < 80) return 'Medium Risk';
    return 'Low Risk';
  }

  getRecommendations() {
    const recommendations = [];
    
    if (this.mathScore < 60) {
      recommendations.push('Focus on Mathematics - consider additional tutoring');
    }
    if (this.scienceScore < 60) {
      recommendations.push('Improve Science understanding through practical exercises');
    }
    if (this.englishScore < 60) {
      recommendations.push('Enhance English skills through reading and writing practice');
    }
    if (this.attendanceRate < 80) {
      recommendations.push('Improve attendance - consistent presence is crucial for learning');
    }
    
    return recommendations;
  }
}

// Hash table implementation for O(1) student lookup
class StudentHashTable {
  constructor() {
    this.table = {};
  }

  insert(key, value) {
    this.table[key] = value;
  }

  get(key) {
    return this.table[key];
  }

  delete(key) {
    delete this.table[key];
  }

  getAll() {
    return Object.values(this.table);
  }

  keys() {
    return Object.keys(this.table);
  }
}

// Binary Search Tree for sorted operations
class BSTNode {
  constructor(student) {
    this.student = student;
    this.left = null;
    this.right = null;
  }
}

class StudentBST {
  constructor() {
    this.root = null;
  }

  insert(student) {
    this.root = this.insertNode(this.root, student);
  }

  insertNode(node, student) {
    if (node === null) {
      return new BSTNode(student);
    }

    if (student.averageScore < node.student.averageScore) {
      node.left = this.insertNode(node.left, student);
    } else {
      node.right = this.insertNode(node.right, student);
    }

    return node;
  }

  // Get students sorted by performance (ascending)
  inorderTraversal(node = this.root, result = []) {
    if (node !== null) {
      this.inorderTraversal(node.left, result);
      result.push(node.student);
      this.inorderTraversal(node.right, result);
    }
    return result;
  }

  // Get top N performers
  getTopPerformers(n = 5) {
    const sorted = this.inorderTraversal();
    return sorted.slice(-n).reverse();
  }

  // Get bottom N performers
  getBottomPerformers(n = 5) {
    const sorted = this.inorderTraversal();
    return sorted.slice(0, n);
  }
}

// Priority Queue for risk management
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(student, priority) {
    const item = { student, priority };
    let added = false;

    for (let i = 0; i < this.queue.length; i++) {
      if (item.priority > this.queue[i].priority) {
        this.queue.splice(i, 0, item);
        added = true;
        break;
      }
    }

    if (!added) {
      this.queue.push(item);
    }
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

// Global variables
const studentsData = [];
const studentHashTable = new StudentHashTable();
const studentBST = new StudentBST();
const riskQueue = new PriorityQueue();
let currentEditingStudent = null;
let filteredStudents = [];
let performanceChart = null;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  loadSampleData();
  setupEventListeners();
  updateAllDisplays();
});

function initializeApp() {
  // Hide all sections except dashboard
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    if (section.id !== 'dashboard') {
      section.style.display = 'none';
    }
  });

  // Load dark mode preference
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    document.getElementById('darkModeToggle').checked = true;
  }
}

function loadSampleData() {
  // Check if data exists in localStorage
  const savedData = localStorage.getItem('studentsData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    parsedData.forEach(studentData => {
      const student = new Student(
        studentData.id,
        studentData.name,
        studentData.className,
        studentData.mathScore,
        studentData.scienceScore,
        studentData.englishScore,
        studentData.attendanceRate
      );
      addStudentToSystem(student, false);
    });
  } else {
    // Load sample data
    const sampleStudents = [
      new Student('1', 'Alice Johnson', '10A', 85, 90, 88, 95),
      new Student('2', 'Bob Smith', '10B', 78, 82, 75, 88),
      new Student('3', 'Charlie Brown', '10A', 92, 94, 89, 97),
      new Student('4', 'Diana Prince', '10C', 65, 70, 72, 85),
      new Student('5', 'Eve Adams', '10B', 88, 85, 90, 92),
      new Student('6', 'Frank Miller', '10A', 72, 68, 75, 80),
      new Student('7', 'Grace Lee', '10C', 95, 98, 92, 98),
      new Student('8', 'Henry Wilson', '10B', 60, 65, 58, 75),
      new Student('9', 'Ivy Chen', '10A', 87, 89, 85, 90),
      new Student('10', 'Jack Davis', '10C', 79, 76, 82, 87)
    ];

    sampleStudents.forEach(student => {
      addStudentToSystem(student, false);
    });
  }
}

function addStudentToSystem(student, save = true) {
  studentsData.push(student);
  studentHashTable.insert(student.id, student);
  studentBST.insert(student);
  
  // Add to risk queue based on risk level
  const riskPriority = student.getRiskLevel() === 'High Risk' ? 3 : 
                      student.getRiskLevel() === 'Medium Risk' ? 2 : 1;
  riskQueue.enqueue(student, riskPriority);

  if (save) {
    saveToLocalStorage();
  }
}

function removeStudentFromSystem(studentId) {
  const index = studentsData.findIndex(s => s.id === studentId);
  if (index !== -1) {
    studentsData.splice(index, 1);
    studentHashTable.delete(studentId);
    
    // Rebuild BST (in a real application, you'd implement BST deletion)
    rebuildBST();
    
    saveToLocalStorage();
  }
}

function rebuildBST() {
  const tempBST = new StudentBST();
  studentsData.forEach(student => {
    tempBST.insert(student);
  });
  // Replace the global BST
  Object.assign(studentBST, tempBST);
}

function saveToLocalStorage() {
  const dataToSave = studentsData.map(student => ({
    id: student.id,
    name: student.name,
    className: student.className,
    mathScore: student.mathScore,
    scienceScore: student.scienceScore,
    englishScore: student.englishScore,
    attendanceRate: student.attendanceRate
  }));
  
  localStorage.setItem('studentsData', JSON.stringify(dataToSave));
  localStorage.setItem('lastUpdated', new Date().toISOString());
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      showSection(targetId);
    });
  });

  // Menu toggle
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
  });

  // Dark mode toggle
  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });

  // Student management
  document.getElementById('addStudentBtn').addEventListener('click', () => {
    openStudentModal();
  });

  document.getElementById('studentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    handleStudentFormSubmit();
  });

  // Search and filter
  document.getElementById('searchInput').addEventListener('input', (e) => {
    filterStudents();
  });

  document.getElementById('classFilter').addEventListener('change', (e) => {
    filterStudents();
  });

  // Predictions
  document.getElementById('runPredictionsBtn').addEventListener('click', () => {
    runPredictionsForAll();
  });

  document.getElementById('generateRecommendationsBtn').addEventListener('click', () => {
    generateRecommendations();
  });

  // Reports
  document.getElementById('generateReportBtn').addEventListener('click', () => {
    generateReport();
  });

  // Communication
  document.getElementById('sendAnnouncementBtn').addEventListener('click', () => {
    sendAnnouncement();
  });

  document.getElementById('announcementInput').addEventListener('input', (e) => {
    updateCharCount(e.target.value);
  });

  // Settings
  document.getElementById('clearDataBtn').addEventListener('click', () => {
    clearAllData();
  });

  document.getElementById('backupDataBtn').addEventListener('click', () => {
    backupData();
  });

  // Modal close
  document.querySelector('.close').addEventListener('click', () => {
    closeModal();
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('studentModal');
    if (e.target === modal) {
      closeModal();
    }
  });
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });

  // Show target section
  document.getElementById(sectionId).style.display = 'block';

  // Update displays based on section
  switch (sectionId) {
    case 'dashboard':
      updateDashboard();
      break;
    case 'students':
      updateStudentTable();
      break;
    case 'marks':
      updateMarksDisplay();
      break;
    case 'analytics':
      updateAnalytics();
      break;
  }
}

function updateDashboard() {
  const totalStudents = studentsData.length;
  const averageScore = totalStudents > 0 ? 
    studentsData.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents : 0;
  const attendanceRate = totalStudents > 0 ? 
    studentsData.reduce((sum, s) => sum + s.attendanceRate, 0) / totalStudents : 0;
  
  const riskAnalysis = getRiskAnalysis();
  const topPerformers = studentBST.getTopPerformers(5);

  document.getElementById('totalStudents').textContent = totalStudents;
  document.getElementById('averageScore').textContent = averageScore.toFixed(1) + '%';
  document.getElementById('attendanceRate').textContent = attendanceRate.toFixed(1) + '%';
  document.getElementById('highRiskStudents').textContent = riskAnalysis['High Risk'];
  document.getElementById('topPerformers').textContent = topPerformers.length;
  
  // Update pie chart
  updatePerformancePieChart();
}

function updateStudentTable() {
  const tbody = document.getElementById('studentsTableBody');
  tbody.innerHTML = '';

  const displayStudents = filteredStudents.length > 0 ? filteredStudents : studentsData;

  displayStudents.forEach(student => {
    const row = document.createElement('tr');
    const riskLevel = student.getRiskLevel();
    const riskClass = riskLevel.toLowerCase().replace(' ', '-');
    
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.className}</td>
      <td>${student.averageScore.toFixed(1)}%</td>
      <td>${student.attendanceRate}%</td>
      <td><span class="risk-badge ${riskClass}">${riskLevel}</span></td>
      <td>
        <button onclick="editStudent('${student.id}')">Edit</button>
        <button onclick="deleteStudent('${student.id}')">Delete</button>
        <button onclick="showPrediction('${student.id}')">Predict</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function updateMarksDisplay() {
  const mathAvg = studentsData.reduce((sum, s) => sum + s.mathScore, 0) / studentsData.length;
  const scienceAvg = studentsData.reduce((sum, s) => sum + s.scienceScore, 0) / studentsData.length;
  const englishAvg = studentsData.reduce((sum, s) => sum + s.englishScore, 0) / studentsData.length;

  document.getElementById('mathAvg').textContent = mathAvg.toFixed(1) + '%';
  document.getElementById('scienceAvg').textContent = scienceAvg.toFixed(1) + '%';
  document.getElementById('englishAvg').textContent = englishAvg.toFixed(1) + '%';

  // Attendance analysis
  const excellentAttendance = studentsData.filter(s => s.attendanceRate > 90).length;
  const goodAttendance = studentsData.filter(s => s.attendanceRate >= 80 && s.attendanceRate <= 90).length;
  const poorAttendance = studentsData.filter(s => s.attendanceRate < 80).length;

  document.getElementById('excellentAttendance').textContent = excellentAttendance;
  document.getElementById('goodAttendance').textContent = goodAttendance;
  document.getElementById('poorAttendance').textContent = poorAttendance;
}

function updateAnalytics() {
  const riskAnalysis = getRiskAnalysis();
  
  document.getElementById('highRiskCount').textContent = riskAnalysis['High Risk'];
  document.getElementById('mediumRiskCount').textContent = riskAnalysis['Medium Risk'];
  document.getElementById('lowRiskCount').textContent = riskAnalysis['Low Risk'];

  updateClassPerformanceChart();
}

function updateClassPerformanceChart() {
  const classData = getClassAnalysis();
  const container = document.getElementById('classPerformanceChart');
  container.innerHTML = '';

  Object.keys(classData).forEach(className => {
    const data = classData[className];
    const item = document.createElement('div');
    item.className = 'class-performance-item';
    item.style.cssText = `
      display: flex;
      justify-content: space-between;
      padding: 10px;
      margin: 5px 0;
      background: #f8f9fa;
      border-radius: 5px;
      border-left: 4px solid #667eea;
    `;
    
    item.innerHTML = `
      <span><strong>${className}</strong> (${data.count} students)</span>
      <span>${data.avgScore.toFixed(1)}% avg</span>
    `;
    container.appendChild(item);
  });
}

function getRiskAnalysis() {
  const riskLevels = { 'High Risk': 0, 'Medium Risk': 0, 'Low Risk': 0 };
  
  studentsData.forEach(student => {
    riskLevels[student.getRiskLevel()]++;
  });
  
  return riskLevels;
}

// Pie chart function for performance analysis
function updatePerformancePieChart() {
  const ctx = document.getElementById('performanceChart').getContext('2d');
  
  // If chart already exists, destroy it
  if (performanceChart) {
    performanceChart.destroy();
  }
  
  // Get performance data
  const performanceRanges = getPerformanceRanges();
  
  // Create pie chart
  performanceChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Excellent (90-100%)', 'Good (80-89%)', 'Average (70-79%)', 'Below Average (60-69%)', 'Poor (<60%)'],
      datasets: [{
        data: [
          performanceRanges.excellent,
          performanceRanges.good,
          performanceRanges.average,
          performanceRanges.belowAverage,
          performanceRanges.poor
        ],
        backgroundColor: [
          '#4CAF50',  // Green for excellent
          '#8BC34A',  // Light green for good
          '#FFC107',  // Yellow for average
          '#FF9800',  // Orange for below average
          '#f44336'   // Red for poor
        ],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#fff',
            font: {
              size: 10
            },
            padding: 10
          }
        },
        title: {
          display: true,
          text: 'Student Performance Distribution',
          color: '#fff',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });
}

// Function to categorize students by performance ranges
function getPerformanceRanges() {
  const ranges = {
    excellent: 0,    // 90-100%
    good: 0,         // 80-89%
    average: 0,      // 70-79%
    belowAverage: 0, // 60-69%
    poor: 0          // <60%
  };
  
  studentsData.forEach(student => {
    const avgScore = student.averageScore;
    
    if (avgScore >= 90) {
      ranges.excellent++;
    } else if (avgScore >= 80) {
      ranges.good++;
    } else if (avgScore >= 70) {
      ranges.average++;
    } else if (avgScore >= 60) {
      ranges.belowAverage++;
    } else {
      ranges.poor++;
    }
  });
  
  return ranges;
}

function getClassAnalysis() {
  const classData = {};
  
  studentsData.forEach(student => {
    if (!classData[student.className]) {
      classData[student.className] = {
        count: 0,
        totalScore: 0,
        totalAttendance: 0,
        avgScore: 0,
        avgAttendance: 0
      };
    }
    
    classData[student.className].count++;
    classData[student.className].totalScore += student.averageScore;
    classData[student.className].totalAttendance += student.attendanceRate;
  });
  
  // Calculate averages
  Object.keys(classData).forEach(className => {
    const data = classData[className];
    data.avgScore = data.totalScore / data.count;
    data.avgAttendance = data.totalAttendance / data.count;
  });
  
  return classData;
}

function filterStudents() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const classFilter = document.getElementById('classFilter').value;
  
  filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm) || 
                         student.id.includes(searchTerm);
    const matchesClass = !classFilter || student.className === classFilter;
    
    return matchesSearch && matchesClass;
  });
  
  updateStudentTable();
}

function openStudentModal(student = null) {
  const modal = document.getElementById('studentModal');
  const form = document.getElementById('studentForm');
  const title = document.getElementById('modalTitle');
  
  if (student) {
    title.textContent = 'Edit Student';
    currentEditingStudent = student;
    
    // Fill form with student data
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentClass').value = student.className;
    document.getElementById('mathScore').value = student.mathScore;
    document.getElementById('scienceScore').value = student.scienceScore;
    document.getElementById('englishScore').value = student.englishScore;
    document.getElementById('attendanceRate').value = student.attendanceRate;
  } else {
    title.textContent = 'Add New Student';
    currentEditingStudent = null;
    form.reset();
  }
  
  modal.style.display = 'block';
}

function closeModal() {
  document.getElementById('studentModal').style.display = 'none';
  currentEditingStudent = null;
}

function handleStudentFormSubmit() {
  const formData = new FormData(document.getElementById('studentForm'));
  
  const studentData = {
    id: currentEditingStudent ? currentEditingStudent.id : generateId(),
    name: formData.get('name'),
    className: formData.get('class'),
    mathScore: parseInt(formData.get('mathScore')),
    scienceScore: parseInt(formData.get('scienceScore')),
    englishScore: parseInt(formData.get('englishScore')),
    attendanceRate: parseInt(formData.get('attendanceRate'))
  };

  if (currentEditingStudent) {
    // Update existing student
    Object.assign(currentEditingStudent, studentData);
    rebuildBST();
    saveToLocalStorage();
    showNotification('Student updated successfully!', 'success');
  } else {
    // Add new student
    const student = new Student(
      studentData.id,
      studentData.name,
      studentData.className,
      studentData.mathScore,
      studentData.scienceScore,
      studentData.englishScore,
      studentData.attendanceRate
    );
    
    addStudentToSystem(student);
    showNotification('Student added successfully!', 'success');
  }
  
  closeModal();
  updateAllDisplays();
}

function editStudent(studentId) {
  const student = studentHashTable.get(studentId);
  if (student) {
    openStudentModal(student);
  }
}

function deleteStudent(studentId) {
  if (confirm('Are you sure you want to delete this student?')) {
    removeStudentFromSystem(studentId);
    updateAllDisplays();
    showNotification('Student deleted successfully!', 'success');
  }
}

function showPrediction(studentId) {
  const student = studentHashTable.get(studentId);
  if (!student) return;
  
  const prediction = student.predictPerformance();
  const riskLevel = student.getRiskLevel();
  const recommendations = student.getRecommendations();
  
  // Create modal for prediction
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'block';
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h3>Performance Prediction for ${student.name}</h3>
      <div class="prediction-details">
        <p><strong>Current Average:</strong> ${student.averageScore.toFixed(1)}%</p>
        <p><strong>Predicted Performance:</strong> ${prediction.toFixed(1)}%</p>
        <p><strong>Risk Level:</strong> <span class="risk-badge ${riskLevel.toLowerCase().replace(' ', '-')}">${riskLevel}</span></p>
        <p><strong>Attendance:</strong> ${student.attendanceRate}%</p>
        
        <h4>Recommendations:</h4>
        <ul>
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function runPredictionsForAll() {
  showLoading();
  
  setTimeout(() => {
    const results = studentsData.map(student => ({
      student: student,
      prediction: student.predictPerformance(),
      riskLevel: student.getRiskLevel()
    }));
    
    // Sort by risk level (high risk first)
    results.sort((a, b) => {
      const riskOrder = { 'High Risk': 3, 'Medium Risk': 2, 'Low Risk': 1 };
      return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    });
    
    displayPredictionResults(results);
    hideLoading();
  }, 1000);
}

function displayPredictionResults(results) {
  const container = document.getElementById('predictionResults');
  container.innerHTML = '<h3>Prediction Results</h3>';
  
  results.forEach(result => {
    const item = document.createElement('div');
    item.className = 'prediction-item';
    
    item.innerHTML = `
      <h4>${result.student.name} (${result.student.className})</h4>
      <div class="prediction-score">${result.prediction.toFixed(1)}%</div>
      <span class="risk-badge ${result.riskLevel.toLowerCase().replace(' ', '-')}">${result.riskLevel}</span>
      <p>Current Average: ${result.student.averageScore.toFixed(1)}%</p>
    `;
    
    container.appendChild(item);
  });
}

function generateRecommendations() {
  const highRiskStudents = studentsData.filter(s => s.getRiskLevel() === 'High Risk');
  const container = document.getElementById('predictionResults');
  
  container.innerHTML = '<h3>Recommendations for High Risk Students</h3>';
  
  if (highRiskStudents.length === 0) {
    container.innerHTML += '<p>No high risk students found. Great job!</p>';
    return;
  }
  
  highRiskStudents.forEach(student => {
    const recommendations = student.getRecommendations();
    const item = document.createElement('div');
    item.className = 'prediction-item';
    
    item.innerHTML = `
      <h4>${student.name} (${student.className})</h4>
      <ul>
        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    `;
    
    container.appendChild(item);
  });
}

function generateReport() {
  const reportData = {
    totalStudents: studentsData.length,
    averageScore: studentsData.reduce((sum, s) => sum + s.averageScore, 0) / studentsData.length,
    attendanceRate: studentsData.reduce((sum, s) => sum + s.attendanceRate, 0) / studentsData.length,
    topPerformers: studentBST.getTopPerformers(5),
    bottomPerformers: studentBST.getBottomPerformers(5),
    riskAnalysis: getRiskAnalysis(),
    classAnalysis: getClassAnalysis()
  };
  
  displayReport(reportData);
}

function displayReport(reportData) {
  const container = document.getElementById('reportDisplay');
  
  container.innerHTML = `
    <h3>Performance Report</h3>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    
    <h4>Summary Statistics</h4>
    <p>Total Students: ${reportData.totalStudents}</p>
    <p>Average Score: ${reportData.averageScore.toFixed(1)}%</p>
    <p>Average Attendance: ${reportData.attendanceRate.toFixed(1)}%</p>
    
    <h4>Risk Analysis</h4>
    <p>High Risk: ${reportData.riskAnalysis['High Risk']} students</p>
    <p>Medium Risk: ${reportData.riskAnalysis['Medium Risk']} students</p>
    <p>Low Risk: ${reportData.riskAnalysis['Low Risk']} students</p>
    
    <h4>Top Performers</h4>
    <ul>
      ${reportData.topPerformers.map(student => 
        `<li>${student.name} - ${student.averageScore.toFixed(1)}%</li>`
      ).join('')}
    </ul>
    
    <h4>Students Needing Attention</h4>
    <ul>
      ${reportData.bottomPerformers.map(student => 
        `<li>${student.name} - ${student.averageScore.toFixed(1)}%</li>`
      ).join('')}
    </ul>
    
    <h4>Class Performance</h4>
    ${Object.keys(reportData.classAnalysis).map(className => {
      const data = reportData.classAnalysis[className];
      return `<p><strong>${className}:</strong> ${data.count} students, ${data.avgScore.toFixed(1)}% average</p>`;
    }).join('')}
  `;
}

function sendAnnouncement() {
  const input = document.getElementById('announcementInput');
  const message = input.value.trim();
  
  if (!message) {
    showNotification('Please enter a message', 'warning');
    return;
  }
  
  if (message.length > 500) {
    showNotification('Message too long (max 500 characters)', 'error');
    return;
  }
  
  const messageHistory = document.getElementById('messageHistory');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message admin-message';
  
  messageDiv.innerHTML = `
    <span class="message-sender">Admin</span>
    <span class="message-text">${message}</span>
    <span class="message-time">${new Date().toLocaleTimeString()}</span>
  `;
  
  messageHistory.appendChild(messageDiv);
  messageHistory.scrollTop = messageHistory.scrollHeight;
  
  input.value = '';
  updateCharCount('');
  showNotification('Announcement sent!', 'success');
}

function updateCharCount(text) {
  const count = text.length;
  const charCountElement = document.getElementById('charCount');
  charCountElement.textContent = `${count}/500 characters`;
  
  if (count > 500) {
    charCountElement.style.color = '#f44336';
  } else {
    charCountElement.style.color = '#666';
  }
}

function clearAllData() {
  if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
    studentsData.length = 0;
    Object.keys(studentHashTable.table).forEach(key => {
      delete studentHashTable.table[key];
    });
    
    // Clear BST
    studentBST.root = null;
    
    localStorage.removeItem('studentsData');
    localStorage.removeItem('lastUpdated');
    
    updateAllDisplays();
    showNotification('All data cleared successfully!', 'success');
  }
}

function backupData() {
  const data = {
    students: studentsData.map(s => ({
      id: s.id,
      name: s.name,
      className: s.className,
      mathScore: s.mathScore,
      scienceScore: s.scienceScore,
      englishScore: s.englishScore,
      attendanceRate: s.attendanceRate
    })),
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `students_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('Backup created successfully!', 'success');
}

function updateAllDisplays() {
  updateDashboard();
  updateStudentTable();
  updateMarksDisplay();
  updateAnalytics();
  
  // Update system info
  document.getElementById('totalRecords').textContent = studentsData.length;
  const lastUpdated = localStorage.getItem('lastUpdated');
  if (lastUpdated) {
    document.getElementById('lastUpdated').textContent = new Date(lastUpdated).toLocaleString();
  }
}

function generateId() {
  // Find the highest existing ID and increment by 1
  const existingIds = studentsData.map(student => parseInt(student.id)).filter(id => !isNaN(id));
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 10;
  return (maxId + 1).toString();
}

function showLoading() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Advanced algorithms for performance analysis
function performLinearRegression(data) {
  const n = data.length;
  const sumX = data.reduce((sum, point, index) => sum + index, 0);
  const sumY = data.reduce((sum, point) => sum + point, 0);
  const sumXY = data.reduce((sum, point, index) => sum + index * point, 0);
  const sumXX = data.reduce((sum, point, index) => sum + index * index, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}

function predictTrend(studentId) {
  const student = studentHashTable.get(studentId);
  if (!student) return null;
  
  const scores = [student.mathScore, student.scienceScore, student.englishScore];
  const regression = performLinearRegression(scores);
  
  return {
    trend: regression.slope > 0 ? 'improving' : regression.slope < 0 ? 'declining' : 'stable',
    nextPrediction: regression.intercept + regression.slope * 3
  };
}

// Quick sort implementation for custom sorting
function quickSort(arr, compareFunction) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (i === Math.floor(arr.length / 2)) continue;
    
    if (compareFunction(arr[i], pivot) < 0) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  
  return [...quickSort(left, compareFunction), pivot, ...quickSort(right, compareFunction)];
}

// Export functionality
function exportToCSV() {
  const headers = ['ID', 'Name', 'Class', 'Math Score', 'Science Score', 'English Score', 'Attendance Rate', 'Average Score', 'Risk Level'];
  const rows = studentsData.map(student => [
    student.id,
    student.name,
    student.className,
    student.mathScore,
    student.scienceScore,
    student.englishScore,
    student.attendanceRate,
    student.averageScore.toFixed(1),
    student.getRiskLevel()
  ]);
  
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize export functionality
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('exportBtn')) {
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
  }
});
