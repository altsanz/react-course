import React, { FC, useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { FilterComponent } from "../../components";
import styles from "./styles";
import locale from "../../shared/locale";
import logo from "../../shared/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../interfaces/appInterfaces";
import { removeClearFilters, setFilterDataFromFilter } from "../../actions/filterActions";
import { Button } from "@material-ui/core";
import {
  useFetchGetAllListMutation,
  useFetchGetFilteredListMutation
} from "../../services/app.query";

const AppBarComponent: FC<any> = ({ children }) => {
  const dispatch = useDispatch();
  const isFiltered = useSelector((state: State) => state.filter.isFiltered);
  const {mutateAsync: applyFilters } = useFetchGetFilteredListMutation();
  const [textFilterValue, setTextFilterValue] = useState("");
  const personNameFilterState = useSelector(
    (state: State) => state.filter.personName
  );

  const filterData = useSelector((state: State) => state.filter);
  const classes = styles();
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: getAllData } = useFetchGetAllListMutation();

  useEffect(() => {
    console.log('holis')
    setTextFilterValue(personNameFilterState);
  }, [personNameFilterState]);

  const toggleDrawer = (anchor: any, open: boolean) => () => {
    setIsOpen(open);
  };

  const onChange = (data: any) => {
    const newFilter = { ...filterData, personName: data.target.value }
    
    applyFilters(newFilter);
  };

  const onClickClearFilter = () => {
    dispatch(removeClearFilters());
    getAllData();
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer("left", true)}
            onKeyDown={toggleDrawer("left", true)}
          >
            <Typography className={classes.title} variant="h6" noWrap>
              {locale.Filter}
            </Typography>
            <SearchIcon className={classes.filterIcon} />
          </IconButton>
          <div className={classes.title}>
            <img
              className={classes.logoImageTitle}
              alt="CoverImage"
              src={logo}
            />
          </div>
          {isFiltered && (
            <Button
              variant="contained"
              color="secondary"
              onClick={onClickClearFilter}
            >
              {locale.ClearFilters}
            </Button>
          )}
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder={locale.SearchByPersonsName}
              onChange={onChange}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search", "value": filterData.personName }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer("left", false)}>
        <FilterComponent />
      </Drawer>
      {children}
    </div>
  );
};

export default AppBarComponent;
