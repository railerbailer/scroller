import React, { Component } from "react";
import "../App.css";
import {
  Icon,
  Button,
  Spin,
  message,
  notification,
  Menu,
  Dropdown,
  AutoComplete,
  Switch
} from "antd";
import { Transition } from "react-transition-group";

class TopMenu extends Component {
  state = {
    isSearchActivated: true,
    isDropDownShowing: true
  };

  showDropdown = () => {
    this.setState({ isDropDownShowing: !this.state.isDropDownShowing });
  };

  searchBoxOpenClose = () => {
    this.setState({ isSearchActivated: !this.state.isSearchActivated });
  };
  onSelect = value => {
    this.getSubreddit(value);
    this.searchBoxOpenClose();
  };
  renderMenu = () => {
    const categories = ["NSFW", "SFW", "ART", "ANIMALS", "FOOD"];
    const menuItems = categories.map((category, key) =>   (
      <Menu.Item key={key}>
        <div onClick={e => this.changeCat(e, category)}>{category}</div>
      </Menu.Item>
    ));
    return (
      <Menu theme="dark">
        <Menu.Item>
          <Icon
            onClick={this.showDropdown}
            type="close"
            style={{ color: "white", fontSize: "22px" }}
          />
        </Menu.Item>
        <Menu.Item disabled>{this.props.category}</Menu.Item>
        <Menu.Divider />
        {menuItems}
        <Menu.Divider />
        <Menu.Item>
          Gif only:
          <Switch onChange={this.toggleGifsOnly} />
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    return (
      <div className="topMenuWrapper">
        <div className="searchWrapper">
          <Transition
            in={this.state.isSearchActivated}
            unmountOnExit
            mountOnEnter
            timeout={100}
          >
            {status => (
              <AutoComplete
                placeholder="Search here"
                autoFocus
                className={`autocomplete--${status}`}
                // dataSource={this.state.dataSource}
                onBlur={() =>
                  this.setState({
                    isSearchActivated: false
                  })
                }
                onSelect={this.onSelect}
                onSearch={this.handleSearch}
              />
            )}
          </Transition>

          <Transition
            in={!this.state.isSearchActivated}
            unmountOnExit
            mountOnEnter
            timeout={0}
          >
            {status => (
              <Button
                ghost
                className={`searchButton--${status}`}
                onClick={() => this.searchBoxOpenClose()}
              >
                <Icon type="search" />
              </Button>
            )}
          </Transition>
        </div>

        <h1 className="logo">sliddit.</h1>

        <Dropdown
          visible={this.state.isDropDownShowing}
          overlay={this.renderMenu()}
          onClick={this.showDropdown}
        >
          <Button ghost className="settings-icon">
            <Icon type="setting" className="chooseCat" />
          </Button>
        </Dropdown>
      </div>
    );
  }
}

export default TopMenu;
