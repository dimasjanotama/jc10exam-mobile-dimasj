import React, { useEffect } from 'react'
import { View, Text, TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Header, Content, Body, Card, CardItem, Left, Button, Icon, List, ListItem, Right, Title } from 'native-base'
import firebase from 'firebase'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'

const TodoListScreen = props => {
    const dispatch = useDispatch()
    const todoInput = useSelector(state => state.todo.todoInput)
    const todoData = useSelector(state => state.todo.todoData)

    useEffect(() => {
        firebase.database().ref('/').once('value', snapshot => {
            // console.log(snapshot.val())
            // console.log(Object.values(snapshot.val()))
            // console.log(todoData)
            if (snapshot.val()) {
                dispatch({ 
                    type: 'FILL_TODO',
                    payload: Object.values(snapshot.val())
                })
            }
        })
    }, [])
    
    const getData = () => {
        firebase.database().ref('/').on('value', snapshot => {
            dispatch({
                type: 'FILL_TODO',
                payload: Object.values(snapshot.val())
            })
        })
    }

    const onAddTodo = () => {
        var newPostKey = firebase.database().ref().push().key
        firebase.database().ref(`/${newPostKey}`).set({
            todo: todoInput,
            dateCreated: new Date().toLocaleDateString('id-ID'),
            dateCompleted: 'N/A',
            status: 'unfinished',
            id: newPostKey
        })
        .catch(err => {
            console.log(err)
        })
        getData();
    }

    const clickOpen = (id) => {
        props.navigation.navigate('TodoDetailScreen', {id})
    }

    const clickFinished = (id) => {
        let status = 'finished'
        firebase.database().ref(`/${id}`).update({
            status
        });
        getData()
    }

    const renderButton = (item) => {
        if(item.status === 'unfinished'){ 
            return (
                <Button info style={{ padding: 10 }}>
                    <Text style={{ color: 'white'}} onPress={() => clickFinished(item.id,item.status)} >{item.status}</Text>
                </Button>
            )
        } else {
            return (
                <Button success style={{ padding: 10 }}>
                    <Text style={{ color: 'white'}} onPress={() => clickFinished(item.id,item.status)} >{item.status}</Text>
                </Button>
            )
        }
    }

    return (
        <Container>
            <Header>
                <Title style={{ marginTop: 10 }}>See you next time</Title>
            </Header>
            <Card >
                    <CardItem style={{ backgroundColor: 'navy' }} header>
                        <View style={{ width: '90%', borderBottomColor: 'white', borderBottomWidth: 1, paddingVertical: 10, marginLeft: '5%' }}>
                            <TextInput style={{ fontSize: 16, color: 'white' }} placeholderTextColor='white' placeholder="What do you wanna do?" onChangeText={text => dispatch({
                                type: 'TODO_INPUT',
                                payload: text
                            })} />
                        </View>
                    </CardItem>
                    <CardItem style={{ backgroundColor: 'navy', justifyContent: 'center' }}>
                        <Button onPress={onAddTodo} transparent icon style={{ borderRadius: 50, borderColor: 'white', borderWidth: 1, backgroundColor: '#ee4b77' }} >
                            <Icon type='AntDesign' style={{ color: 'white' }} name='plus' />
                        </Button>
                    </CardItem>
                </Card>
            <Content>
                <List
                dataArray={todoData}
                keyExtractor={item => item.id}
                renderRow={item => {
                    return (
                    <ListItem>
                        <Left>
                            {renderButton(item)}
                        </Left>
                        <Body>
                            <Text>{item.todo}</Text>
                        </Body>
                        <Right style={{ width: '100%'}}>
                            <TouchableOpacity>
                                <Text onPress={()=> {clickOpen(item.id)}} style={{ color: 'lightblue'}}>Open</Text>
                            </TouchableOpacity>
                        </Right>
                    </ListItem>
                    )
                }}
                >
                </List>
            </Content>
        </Container>
    )
}

export default TodoListScreen