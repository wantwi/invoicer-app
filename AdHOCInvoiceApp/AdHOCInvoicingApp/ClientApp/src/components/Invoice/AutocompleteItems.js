import { FormContext } from "components/Modals/NewInvoice";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import ItemsSuggestionsList from "./ItemsSuggestionsList";
// import { AsyncTypeahead } from "react-bootstrap-typeahead"

const SEARCH_URI = 'https://api.github.com/search/users';
const AutocompleteItems = ({
  suggestions,
  formData,
  gridData,
  setFormData,
  setDisabled,
  setIsTaxable,
  isPurchasing = false,
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setSelectedItems(gridData?.map((item) => item?.itemName));
  }, [gridData]);

  const onChange = (e) => {
    const userInput = e.target.value;

    // Filter our suggestions that don't contain the user's input
    const unLinked = suggestions.filter((suggestion) =>
      suggestion.name.toLowerCase().includes(userInput.toLowerCase())
    );

    setFormData({ ...formData, itemName: userInput });
    setFilteredSuggestions(unLinked);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };

  const ensureNoDuplicateSel = (item) => selectedItems?.includes(item);

  const onClick = (suggestion) => {
    // console.log("called");
    if (ensureNoDuplicateSel(suggestion.name)) {
      toast.warning(`${suggestion.name} already selected`);
      return;
    }
    setFilteredSuggestions([]);
    setFormData((prev) => {
      //adding isPurchasing (i.e the call is from the purchase Invoice component) is true; it will avoid setting other formdata apart from itemName
      if (isPurchasing) {
        return {
          ...prev,
          itemName: suggestion.name,
          vatItemId: suggestion?.id,
        };
      }

      setIsTaxable(suggestion?.taxable);
      return {
        ...formData,
        itemName: suggestion.name,
        price: suggestion?.price,
        vatItemId: suggestion?.id,
        itemCode: suggestion?.code,
        otherLevies: suggestion?.otherLevies,
        isTaxInclusive: suggestion?.isTaxInclusive,
        discountTypeName: suggestion?.discountTypeName,
        discount: suggestion?.discount
      };
    });
    // suggestion.taxable === true ? setIsTaxable(true) : setIsTaxable(false)
    setActiveSuggestionIndex(0);
    setShowSuggestions(false);
    setDisabled(false);
  };
  const onFocus = () => {
    setShowSuggestions((prev) => !prev);
    setActiveSuggestionIndex(0);
    setFilteredSuggestions(suggestions);
  };

  // const [isLoading, setIsLoading] = useState(false);
  // const [options, setOptions] = useState([]);

  // const handleSearch = (query) => {
  //   setIsLoading(true);

  //   fetch(`${SEARCH_URI}?q=${query}+in:login&page=1&per_page=50`)
  //     .then((resp) => resp.json())
  //     .then(({ items }) => {
  //       setOptions(items);
  //       setIsLoading(false);
  //     });
  // };
  // const filterBy = () => true;
  return (
    <>
 {/* <AsyncTypeahead
 size="sm"
      filterBy={filterBy}
      id="async-example"
      isLoading={isLoading}
      labelKey="login"
      minLength={3}
      onSearch={handleSearch}
      options={options}
      placeholder="Search for an item by code or name..."
      renderMenuItemChildren={(option) => (
        <>
          <img
            alt={option.login}
            src={option.avatar_url}
            style={{
              height: '24px',
              marginRight: '10px',
              width: '24px',
            }}
          />
          <span>{option.login}</span>
        </>
      )}
    /> */}

      <InputGroup className="input-group-alternative" onClick={onFocus}>
        <ItemSugestionInputField
          onChange={onChange}
          value={formData.itemName}
        />
        <InputGroupAddon
          addonType="append"
          onClick={() => setShowSuggestions(false)}
        >
          <InputGroupText>
            <i
              className={
                showSuggestions ? "fas fa-angle-up" : "fas fa-angle-down"
              }
            />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {showSuggestions && (
        <ItemsSuggestionsList
          filteredSuggestions={filteredSuggestions}
          activeSuggestionIndex={activeSuggestionIndex}
          onClick={onClick}
        />
      )}
    </>
  );
};

const ItemSugestionInputField = ({ onChange, onFocus, value }) => {
  return (
    <Input
      className="form-control-alternative"
      type="text"
      placeholder="Select Item"
      onChange={onChange}
      onKeyDown={onChange}
      value={value}
      onFocus={onFocus}
    />
  );
};

export default AutocompleteItems;
