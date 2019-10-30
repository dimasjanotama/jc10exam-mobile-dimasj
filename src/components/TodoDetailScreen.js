import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Container, Card, CardItem, H1, Button, Body } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import firebase from 'firebase'

const TodoDetailScreen = props => {

    const [Todo, setTodo] = useState({id : '', status : '', dateCreated : '', dateCompleted : '', todo : '' })
    const todoData = useSelector(state => state.todo.todoData);
    const dispatch = useDispatch()

    useEffect(() => {
        const { id } = props.navigation.state.params
        todoData.map(item => { if (item.id === id) setTodo(item) })
    }, [])

    const deleteTodo = () => {
        firebase.database().ref(`/${Todo.id}`).remove()
        .catch(err => {
            console.log(err)
        })
        firebase.database().ref('/').on('value', snapshot => {
            if (snapshot.val())
                dispatch({
                    type: 'FILL_TODO',
                    payload: Object.values(snapshot.val())
                })
        })
        props.navigation.goBack()
    }

    return (
        <Container>
             <Card style={{ marginTop: '50%' }}>
                <CardItem header>
                    <Body>
                        <H1>
                            Todo: { Todo.todo }
                        </H1>
                        <Text>
                            ID: { Todo.id }
                        </Text>
                    </Body>
                </CardItem>
                <CardItem>
                    <Text>
                        Status: { Todo.status }
                    </Text>
                </CardItem>
                <CardItem>
                    <Text>
                        Date Created: { Todo.dateCreated }
                    </Text>
                </CardItem>
                <CardItem>
                    <Text>
                        Date Completed: { Todo.dateCompleted }
                    </Text>
                </CardItem>
                <CardItem>
                    <Button info>
                        <Text onPress={()=>props.navigation.goBack()} >Go Back</Text>
                    </Button>
                    <Button danger>
                        <Text onPress={deleteTodo} >Delete</Text>
                    </Button>
                </CardItem>
            </Card>
        </Container>
    )
}

export default TodoDetailScreen