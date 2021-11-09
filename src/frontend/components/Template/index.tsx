import React, { useState } from "react";
import { Container, Collapse } from "react-bootstrap";
import { MdPerson, MdMenu, MdExpandMore, MdDashboard } from "react-icons/md";
import { GiRolledCloth, GiAbstract035, GiAbstract070 } from "react-icons/gi";
import { BsFillLayersFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import classes from "./template.module.scss";

const Template = ({ children }) => {
  const [sidenav, setSidenav] = useState(false);
  const [pembelianSarungOpen, setPembelianSarungOpen] = useState(false);
  const [jahitanSarungOpen, setJahitanSarungOpen] = useState(false);
  const [pranggokOpen, setPranggokOpen] = useState(false);
  const [penjualanBatikOpen, setPenjualanBatikOpen] = useState(false);
  const [active, setActive] = useState("");
  return (
    <>
      <Container fluid className={classes.body}>
        <div
          className={sidenav ? classes.sidenavOpen : ""}
          id="sidenav-container"
          onClick={(e: any) => {
            if (e.target.id === "sidenav-container") {
              setSidenav(!sidenav);
            }
          }}
        >
          <div
            className={`${classes.sidenav} ${
              sidenav ? classes.sidenavActive : ""
            }`}
          >
            <div className={classes.brand}>Admin Page</div>
            <div className={classes.navLinks}>
              <span className={classes.divider}>Sarung</span>
              <Link to="/admin/dashboard-sarung">
                <button
                  className={`${classes.navLink} ${
                    active === "dashboardSarung" && classes.active
                  }`}
                  onClick={() => {
                    setActive("dashboardSarung");
                    setSidenav(false);
                  }}
                >
                  <MdDashboard className={classes.linkIcon} />
                  Dashboard
                </button>
              </Link>
              <div>
                <button
                  className={classes.navLink}
                  onClick={setPembelianSarungOpen.bind(
                    this,
                    !pembelianSarungOpen
                  )}
                >
                  <GiRolledCloth className={classes.linkIcon} />
                  Pembelian Sarung
                  <MdExpandMore className={classes.expandIcon} />
                </button>
                <Collapse in={pembelianSarungOpen}>
                  <div>
                    <Link to="/admin/pembelian-sarung/pembelian">
                      <button
                        className={`${classes.navLinkDropdown} ${
                          active === "pembelianSarung" && classes.active
                        }`}
                        onClick={() => {
                          setActive("pembelianSarung");
                          setSidenav(false);
                        }}
                      >
                        Pembelian Sarung
                      </button>
                    </Link>
                    <Link to="/admin/pembelian-sarung/pabrik-sarung">
                      <button
                        className={`${classes.navLinkDropdown} ${
                          active === "pabrikSarung" && classes.active
                        }`}
                        onClick={() => {
                          setActive("pabrikSarung");
                          setSidenav(false);
                        }}
                      >
                        Pabrik Sarung
                      </button>
                    </Link>
                  </div>
                </Collapse>
              </div>
              {/* Jahitan & Lipetan */}
              <div>
                <button
                  className={classes.navLink}
                  onClick={setJahitanSarungOpen.bind(this, !jahitanSarungOpen)}
                >
                  <GiAbstract035 className={classes.linkIcon} />
                  Jahitan & Lipetan
                  <MdExpandMore className={classes.expandIcon} />
                </button>
                <Collapse in={jahitanSarungOpen}>
                  <div>
                    <Link to="/admin/jahitan-sarung/jahitan">
                      <button
                        className={`${classes.navLinkDropdown} ${
                          active === "jahitanSarung" && classes.active
                        }`}
                        onClick={() => {
                          setActive("jahitanSarung");
                          setSidenav(false);
                        }}
                      >
                        Jahitan & Lipetan
                      </button>
                    </Link>
                    <Link to="/admin/jahitan-sarung/penjahit">
                      <button
                        className={`${classes.navLinkDropdown} ${
                          active === "penjahitSarung" && classes.active
                        }`}
                        onClick={() => {
                          setActive("penjahitSarung");
                          setSidenav(false);
                        }}
                      >
                        Penjahit Sarung
                      </button>
                    </Link>
                  </div>
                </Collapse>
              </div>
              {/* Pranggok */}
              <div>
                <button
                  className={classes.navLink}
                  onClick={setPranggokOpen.bind(this, !pranggokOpen)}
                >
                  <GiAbstract070 className={classes.linkIcon} />
                  Pranggok
                  <MdExpandMore className={classes.expandIcon} />
                </button>
                <Collapse in={pranggokOpen}>
                  <div>
                    <Link to="/admin/pranggok/biaya-pranggok">
                      <button
                        className={`${classes.navLinkDropdown} ${
                          active === "biayaPranggok" && classes.active
                        }`}
                        onClick={() => {
                          setActive("biayaPranggok");
                          setSidenav(false);
                        }}
                      >
                        Biaya Pranggok
                      </button>
                    </Link>
                    <Link to="/admin/pranggok/pranggok-sarung">
                      <button
                        className={`${classes.navLinkDropdown} ${
                          active === "pranggokSarung" && classes.active
                        }`}
                        onClick={() => {
                          setActive("pranggokSarung");
                          setSidenav(false);
                        }}
                      >
                        Pranggok Sarung
                      </button>
                    </Link>
                  </div>
                </Collapse>
              </div>
              <Link to="/admin/penjualan-sarung">
                <button
                  className={`${classes.navLink} ${
                    active === "penjualanSarung" && classes.active
                  }`}
                  onClick={() => {
                    setActive("penjualanSarung");
                    setSidenav(false);
                  }}
                >
                  <GiRolledCloth className={classes.linkIcon} />
                  Penjualan Sarung
                </button>
              </Link>
              <Link to="/admin/user">
                <button
                  className={`${classes.navLink} ${
                    active === "user" && classes.active
                  }`}
                  onClick={() => {
                    setActive("user");
                    setSidenav(false);
                  }}
                >
                  <MdPerson className={classes.linkIcon} />
                  User
                </button>
              </Link>
              <span className={classes.divider}>Batik</span>
              {/* Penjualan Batik */}
              <div>
                <button
                  className={classes.navLink}
                  onClick={setPenjualanBatikOpen.bind(
                    this,
                    !penjualanBatikOpen
                  )}
                >
                  <BsFillLayersFill className={classes.linkIcon} />
                  Penjualan Batik
                  <MdExpandMore className={classes.expandIcon} />
                </button>
                <Collapse in={penjualanBatikOpen}>
                  <div>
                    <Link to="/admin/penjualan-batik/penjualan">
                      <button
                        className={`${classes.navLinkDropdown} ${
                          active === "penjualanBatik" && classes.active
                        }`}
                        onClick={() => {
                          setActive("penjualanBatik");
                          setSidenav(false);
                        }}
                      >
                        Penjualan Batik
                      </button>
                    </Link>
                    <Link to="/admin/penjualan-batik/pembeli">
                      <button
                        className={`${classes.navLinkDropdown} ${
                          active === "pembeliBatik" && classes.active
                        }`}
                        onClick={() => {
                          setActive("pembeliBatik");
                          setSidenav(false);
                        }}
                      >
                        Identitas Pembeli
                      </button>
                    </Link>
                  </div>
                </Collapse>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.navbar}>
          <button
            className="btn"
            style={{ fontSize: "1.2rem" }}
            onClick={setSidenav.bind(this, true)}
          >
            <MdMenu />
          </button>
        </div>
        <div className={`mt-4 d-flex`}>
          <div className={classes.sidebarMixins}></div>
          <div className={classes.container}>{children}</div>
        </div>
      </Container>
    </>
  );
};

export default Template;
