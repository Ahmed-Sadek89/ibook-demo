import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import cls from "./choose.module.scss";

const Choose = ({
  placeholder,
  results,
  choose,
  value,
  disabled,
  keyword,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredResults, setFilteredResults] = useState(results);
  const inputRef = useRef();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    setFilteredResults(results);
  }, [results]);

  // FILTER RESULTS WITH TYPING
  const filterResults = (typed) => {
    setInputValue(typed);
    if (typed !== "") {
      let filtered = filteredResults.filter((result) =>
        result[keyword].toLowerCase().startsWith(typed.toLowerCase())
      );

      if (filtered.length !== 0) {
        setFilteredResults(filtered);
      } else {
        setFilteredResults(results);
      }
    } else {
      setFilteredResults(results);
    }
  };

  // SELECT CHOOSE OPTION HANDLER
  const selectChoose = (result) => {
    choose(result);
    setOpen(false);
    setFilteredResults(results);
    inputRef.current.id = result.id;
  };

  const blur = () => {
    setTimeout(() => {
      setOpen(false)
    }, 300)
  }

  return (
    <div>
      {/* {open && (
        <div className={cls.overlay} onClick={() => setOpen(false)}></div>
      )} */}

      <div className={cls.field}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => filterResults(e.target.value)}
          onClick={() => setOpen(prev => !prev)}
          disabled={disabled}
          className={error ? cls.error : ""}
          onBlur={blur}
        />
        <Icon icon="iconamoon:arrow-down-2-duotone" width="20px" height="20px" />

        <div className={`${cls.field__results} ${open ? cls.active : ""}`}>
          <div className={cls.field__results_result}>
            {filteredResults?.map((result, idx) => (
              <div
                className={cls.resultInside}
                onClick={() => selectChoose(result)}
                key={idx}
              >
                <p key={result}>{result.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;
