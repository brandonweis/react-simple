export const users = [
    {
        id: 0,
        name: 'Alice',
        groupIds: [0, 1]
    },
    {
        id: 1,
        name: 'Bob',
        groupIds: [0]
    },
    {
        id: 2,
        name: 'Caty',
        groupIds: [1, 0]
    },
    {
        id: 3,
        name: 'Dick',
        groupIds: [1]
    },
    {
        id: 4,
        name: 'Eve',
        groupIds: [2]
    },
]

export const groups = [
    {
        id: 0,
        name: 'marketing',
        userIds: [0, 1, 2]
    },
    {
        id: 1,
        name: 'HR',
        userIds: [0, 2, 3]
    },
    {
        id: 2,
        name: 'engineering',
        userIds: [4]
    },
]

export const doors = [
    {
        id: 0,
        name: 'marketing',
        userIds: [0, 1, 2]
    },
    {
        id: 1,
        name: 'HR',
        userIds: [0, 2, 3]
    },
    {
        id: 2,
        name: 'engineering',
        userIds: [4]
    },
]
