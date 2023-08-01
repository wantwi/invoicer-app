import React, { useState } from 'react'
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import SuggestionsList from './SuggestionsList'

const Autocomplete = ({
  suggestions,
  formData,
  setFormData,
  businessPartner,
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [input, setInput] = useState('')

  const onChange = (e) => {
    const userInput = e.target.value

    // Filter our suggestions that don't contain the user's input
    const unLinked = suggestions.filter((suggestion) =>
      suggestion.name.toLowerCase().includes(userInput.toLowerCase())
    )
    setInput(e.target.value)
    setFormData({ ...formData, customer: userInput })
    setFilteredSuggestions(unLinked)
    setActiveSuggestionIndex(0)
    setShowSuggestions(true)
  }

  const onClick = (suggestion) => {
    // console.log(suggestion)
    setFilteredSuggestions([])
    setInput(suggestion.name)
    setFormData({
      ...formData,
      customer: suggestion.name,
      identity: suggestion.tin,
      email: suggestion.email,
      tel: suggestion.telephone,
    })
    setActiveSuggestionIndex(0)
    setShowSuggestions(false)
  }

  return (
    <>
      <InputGroup className='input-group-alternative' >
        <InputGroupAddon addonType='prepend'>
          <InputGroupText>
            <i className='fas fa-search' />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap"
          }}
          className='form-control-alternative'
          type='text'
          placeholder='Name'
          onChange={onChange}
          onKeyDown={onChange}
          value={input}
        />
      </InputGroup>
      {showSuggestions && input && (
        <SuggestionsList
          filteredSuggestions={filteredSuggestions}
          activeSuggestionIndex={activeSuggestionIndex}
          onClick={onClick}
          businessPartner={businessPartner}
        />
      )}
    </>
  )
}

export default Autocomplete
