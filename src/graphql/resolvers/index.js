import events from './events'
import modules from './modules'
import venues from './venues'
import users from './users'
import timetables from './timetables'

const resolvers = [
	modules,
	events,
	venues,
	users,
	timetables
]

const createMutation = resolvers => resolvers.reduce(
	(mutations, {Mutation}) => ({...mutations, ...Mutation}),
	{}
)

const createQuery = resolvers => resolvers.reduce(
	(queries, {Query}) => ({...queries, ...Query}),
	{}
)


const rootResolver = {
	Query: createQuery(resolvers),
	Mutation: createMutation(resolvers)
}

export default rootResolver