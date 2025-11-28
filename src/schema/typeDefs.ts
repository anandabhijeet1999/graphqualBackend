import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  enum EmployeeSortField {
    NAME
    AGE
    ATTENDANCE
    CLASS
  }

  enum SortDirection {
    ASC
    DESC
  }

  type Employee {
    id: ID!
    name: String!
    age: Int!
    className: String!
    subjects: [String!]!
    attendance: Float!
    title: String!
    department: String!
    email: String!
    phone: String!
    location: String!
    avatar: String!
    bio: String!
    flagged: Boolean!
    hireDate: String!
  }

  type PageInfo {
    page: Int!
    pageSize: Int!
    totalItems: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPrevPage: Boolean!
  }

  type EmployeeConnection {
    nodes: [Employee!]!
    pageInfo: PageInfo!
  }

  input EmployeeFilter {
    search: String
    className: String
    subject: String
    attendanceMin: Float
    attendanceMax: Float
    flagged: Boolean
  }

  input PaginationInput {
    page: Int = 1
    pageSize: Int = 10
  }

  input SortInput {
    field: EmployeeSortField = NAME
    direction: SortDirection = ASC
  }

  input EmployeeInput {
    name: String!
    age: Int!
    className: String!
    subjects: [String!]!
    attendance: Float!
    title: String!
    department: String!
    email: String!
    phone: String!
    location: String!
    avatar: String!
    bio: String!
    hireDate: String!
    flagged: Boolean
  }

  input EmployeeUpdateInput {
    name: String
    age: Int
    className: String
    subjects: [String!]
    attendance: Float
    title: String
    department: String
    email: String
    phone: String
    location: String
    avatar: String
    bio: String
    hireDate: String
    flagged: Boolean
  }

  type AuthUser {
    id: ID!
    name: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: AuthUser!
  }

  type Query {
    employees(
      filter: EmployeeFilter
      pagination: PaginationInput
      sort: SortInput
    ): EmployeeConnection!
    employee(id: ID!): Employee
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeUpdateInput!): Employee!
    flagEmployee(id: ID!, flagged: Boolean!): Employee!
  }
`;

