import { Card } from 'reactstrap'
const ItemsSuggestionsList = ({
  filteredSuggestions,
  activeSuggestionIndex,
  onClick,
}) => {
  return filteredSuggestions.length ? (
    <Card
      style={{
        position: 'absolute',
        width: '93%',
        zIndex: '1000',
        margin: 0,
        maxHeight: '200px',
        overflow: 'auto',
      }}
    >
      {filteredSuggestions.map((suggestion, index) => {
        return (
          <div
            className='customer-item'
            key={index}
            style={{
              padding: '0px',
              borderBottom: '1px solid #e3e3e3',
              alignContent: 'center',
              marginTop: 5,
              marginBottom: 3,
              cursor: 'pointer',
            }}
          >
            <ul
              onClick={() => onClick(suggestion)}
              title={suggestion.description}
            >
              {suggestion.name}
            </ul>
          </div>
        )
      })}
    </Card>
  ) : (
    <div className='no-suggestions'>
      <em style={{ color: 'darkred' }}>No results found on the list</em>
    </div>
  )
}

export default ItemsSuggestionsList
