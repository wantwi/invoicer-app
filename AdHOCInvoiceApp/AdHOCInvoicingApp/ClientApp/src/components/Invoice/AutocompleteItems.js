import { FormContext } from "components/Modals/NewInvoice";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import ItemsSuggestionsList from "./ItemsSuggestionsList";

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

  return (
    <>
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
