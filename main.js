import './style.css'

const e = {
  nav: document.getElementById('projects-nav-list'),
  app: document.getElementById('app'),
}
let state = {
  currentProject: { name: null, instance: null },
}

const PROJECTS = new Map([
  ['Wall Ball', [() => import('./src/wall-ball.js'), { root: e.app }]],
])
const PROJECTS_ARR = [...PROJECTS.entries()]

const loadProject = project => {
  console.log('Load :', project)

  if (state.currentProject.name === project) {
    console.log('The project is already loaded - Reinitializing project')
  } else {
    state.currentProject.name = project
  }

  let [fetchModule, args] = PROJECTS.get(project) || []

  if (!fetchModule)
    return Promise.reject(new Error(`Couldn't find the project "${project}"`))

  return fetchModule.call(null).then(module => {
    state.currentProject.instance?.remove?.()
    // e.app.innerHTML = ''
    let instance = module.init(args)
    state.currentProject.instance = instance
    return instance
  })
}

// -------------------------------------------------------------

function addProject(name) {
  let a = document.createElement('a')
  a.setAttribute('data-name', name)
  a.textContent = name
  a.onclick = function (e) {
    e.preventDefault()
    loadProject.call(null, name)
  }

  e.nav.appendChild(a)
}

// Setup nav
PROJECTS.forEach((value, project) => {
  addProject(project)
})

// Load first project initially
if (!state.currentProject.name && PROJECTS_ARR.length > 0) {
  const [project] = PROJECTS_ARR[0]
  loadProject(project)
}
