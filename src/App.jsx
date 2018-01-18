import React, { Component } from 'react';

class AddTodo extends Component {
  render() {
    return (
      <label className='create-text-label' htmlFor='create-todo-text'>
        I want to...
        <textarea
          className='create-todo-text'
          id='create-todo-text'
          name='text'
          onChange={ this.props.onChange }
          value={ this.props.text }
        />
      </label>
    );
  }
}

class SelectPriority extends Component {
  render() {
    return (
      <label className='create-priority-label' htmlFor='create-todo-priority'>
        How much of a priority is this?
        <select
          className='create-todo-priority'
          name='priority'
          onChange={ this.props.onChange }
        >
          <option value='0'>Select a Priority</option>
          <option value='1'>Low Priority</option>
          <option value='2'>Medium Priority</option>
          <option value='3'>High Priority</option>
        </select>
      </label>
    );
  }
}

class AddButton extends Component {
  render() {
    return (
      <button className='create-todo' onClick={ this.props.onClick }>
        Add
      </button>
    );
  }
}

class AddTodoSection extends Component {
  render() {
    return (
      <form className='add-todo-form'>
        <p className='add-todo-title'>Add New Todo</p>
        <AddTodo onChange={ this.props.onChange } text={ this.props.text } />
        <SelectPriority onChange={ this.props.onChange } />
        <AddButton onClick={ this.props.onClick } />
      </form>
    );
  }
}

class UpdateTodo extends Component {
  render() {
    return (
      <label htmlFor='update-todo-text' className='update-text-label'>
        Description
        <textarea
          className='update-todo-text'
          name='text'
          value={ this.props.text }
          onChange={ this.props.editInputChange }
        />
      </label>
    );
  }
}

class UpdatePriority extends Component {
  render() {
    return (
      <label htmlFor='update-todo-priority' className='update-priority-label'>
        Priority
        <select
          className='update-todo-priority'
          name='priority'
          value={ this.props.priority }
          onChange={ this.props.editInputChange }
        >
          <option value='1'>Low Priority</option>
          <option value='2'>Medium Priority</option>
          <option value='3'>High Priority</option>
        </select>
      </label>
    );
  }
}

class UpdateButton extends Component {
  render() {
    return (
      <button className='update-todo' onClick={ this.props.onSave }>
        Save
      </button>
    );
  }
}

class UpdateTodoSection extends Component {
  render() {
    return (
      <form className='update-todo-form'>
        <UpdateTodo
          editInputChange={ this.props.editInputChange }
          text={ this.props.text }
        />
        <UpdatePriority
          editInputChange={ this.props.editInputChange }
          priority={ this.props.priority }
        />
        <UpdateButton
          onSave={ this.props.onSave }
        />
      </form>
    );
  }
}

class EditTodo extends Component {
  render() {
    return (
      <a
        className='edit-todo'
        onClick={ this.props.onEdit }
      ><i className='fas fa-edit' /></a>
    );
  }
}

class DeleteTodo extends Component {
  render() {
    return (
      <a
        className='delete-todo'
        onClick={ this.props.onDelete }
      ><i className='fas fa-trash' /></a>
    );
  }
}

class TodoItems extends Component {
  render() {
    const todoItems = this.props.todoItems;
    return (
      <ul className='todo-items'>
        { todoItems.map((currentItem) => {
          if (currentItem.editEnabled) {
            return (
              <UpdateTodoSection
                key={ currentItem.id }
                text={ currentItem.text }
                priority={ currentItem.priority }
                editInputChange={ e => this.props.editInputChange(e, currentItem.id) }
                onSave={ e => this.props.onSave(e, currentItem.id) }
              />
            );
          }
          return (
            <li
              key={ currentItem.id }
              //  change color based on priority
              className={ `todo-item priority-${currentItem.priority}` }
            >
              <span className='list-text'>{ currentItem.text }</span>
              <EditTodo
                onEdit={ e => this.props.onEdit(e, currentItem.id) }
              />
              <DeleteTodo
                onDelete={ e => this.props.onDelete(e, currentItem.id) }
              />
            </li>
          );
        })}
      </ul>
    );
  }
}

class ViewTodoSection extends Component {
  render() {
    return (
      <div className='view-todo-section'>
        <p className='view-todo-title'>View Todos</p>
        { (this.props.todoItems.length < 1)
          ? <div className='no-items'>
            <h3 className='welcome-header'>Welcome to Very Simple Todo App!</h3>
            <p className='get-started'>Get started by adding a new todo on the left</p>
          </div>
          : null
        }
        <TodoItems
          todoItems={ this.props.todoItems }
          onDelete={ this.props.onDelete }
          onEdit={ this.props.onEdit }
          editInputChange={ this.props.editInputChange }
          onSave={ this.props.onSave }
        />
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTodo: {
        text: '',
        priority: null,
        id: null,
        editEnabled: false,
      },
      todoItems: [],
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onNewTodo = this.onNewTodo.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.editInputChange = this.editInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onInputChange(e) {
    const target = e.target;
    let value = target.value;
    const name = target.name;

    if (name === 'priority') {
      value = parseInt(value, 10);
    }
    return this.setState({
      newTodo: {
        ...this.state.newTodo,
        [[name]]: value,
      },
    });
  }

  onNewTodo(e) {
    const newTodoCopy = Object.assign({}, this.state.newTodo);
    const todoItemsCopy = this.state.todoItems.slice();
    e.preventDefault();

    if (!newTodoCopy.text) {
      return;
    } else if (!newTodoCopy.priority) {
      return;
    }

    newTodoCopy.id = todoItemsCopy.length;
    todoItemsCopy.push(Object.assign({}, newTodoCopy));
    newTodoCopy.text = '';

    this.setState({
      newTodo: newTodoCopy,
      todoItems: todoItemsCopy,
    });
  }
  //  uses elements identification to updated state.todoitems editenabled
  onEdit(e, id) {
    const todoItemsCopy = this.state.todoItems.slice();
    todoItemsCopy[id].editEnabled = true;
    this.setState({
      todoItems: todoItemsCopy,
    });
  }

  onSave(e, id) {
    e.preventDefault();
    const todoItemsCopy = this.state.todoItems.slice();
    todoItemsCopy[id].editEnabled = false;
    this.setState({
      todoItems: todoItemsCopy,
    });
  }

  editInputChange(e, id) {
    const target = e.target;
    const name = target.name;
    let value = target.value;

    const todoItemsCopy = this.state.todoItems.slice();
    const currentItem = todoItemsCopy[id];

    if (name === 'priority') {
      value = parseInt(value, 10);
    }
    currentItem[name] = value;

    this.setState({
      todoItems: todoItemsCopy,
    });
  }

  deleteItem(e, id) {
    //  grabs item id from deleteTodo class
    //  makes copy of current todoItems
    //  removes targeted item
    const itemId = id;
    const todoItemsCopy = this.state.todoItems.slice();
    todoItemsCopy.splice(itemId, 1);

    const objects = todoItemsCopy.length - itemId;
    const splicedArray = todoItemsCopy.splice(itemId, objects);
    // maps over outdated item ids
    const mappedArray = splicedArray.map((currentItem) => {
      currentItem.id -= 1;
      return currentItem;
    });
    //  concats unchanged array and just mapped array
    const concatArray = todoItemsCopy.concat(mappedArray);
    this.setState({ todoItems: concatArray });
  }

  render() {
    return (
      <div className='container'>
        <div className='head-container'>
          <h1 className='header'>Very Simple Todo App</h1>
          <h3 className='description'>Track all of the things</h3>
          <hr />
        </div>
        <AddTodoSection
          onChange={ this.onInputChange }
          onClick={ this.onNewTodo }
          text={ this.state.newTodo.text }
        />
        <ViewTodoSection
          todoItems={ this.state.todoItems }
          onDelete={ this.deleteItem }
          onEdit={ this.onEdit }
          editInputChange={ this.editInputChange }
          onSave={ this.onSave }
        />
      </div>
    );
  }
}

export default App;
