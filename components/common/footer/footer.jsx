import { useTranslations } from "next-intl";
import React from "react";

const Footer = () => {
  const t = useTranslations("Footer");
  return (
    <footer className="">
      <div className="grid container grid-cols-4 py-10 border-b ">
        <div>
          <h4 className="title-sm mb-3">{t("Donate.title")}</h4>
          <div className="grid gap-2">
            <p>{t("Donate.categories")}</p>
            <p>{t("Donate.crisisRelief")}</p>
            <p>{t("Donate.socialFunds")}</p>
            <p>{t("Donate.supporterSpace")}</p>
          </div>
        </div>

        <div>
          <h4 className="title-sm mb-3">{t("Fundraise.title")}</h4>
          <div className="grid gap-2">
            <p>{t("Fundraise.howTo")}</p>
            <p>{t("Fundraise.fundraising")}</p>
            <p>{t("Fundraise.team")}</p>
            <p>{t("Fundraise.blog")}</p>
            <p>{t("Fundraise.charity")}</p>
            <p>{t("Fundraise.SignUp")}</p>
          </div>
        </div>

        <div>
          <h4 className="title-sm mb-3">{t("About.title")}</h4>
          <div className="grid gap-2">
            <p>{t("About.how")}</p>
            <p>{t("About.blog")}</p>
            <p>{t("About.charity")}</p>
            <p>{t("About.signUp")}</p>
            <p>{t("About.newsroom")}</p>
            <p>{t("About.careers")}</p>
          </div>
        </div>

        <div>
          <h4 className="title-sm mb-3">Help Center</h4>
          <div className="grid gap-2">
            <p>{t("About.how")}</p>
            <p>{t("About.blog")}</p>
            <p>{t("About.charity")}</p>
            <p>{t("About.signUp")}</p>
            <p>{t("About.newsroom")}</p>
            <p>{t("About.careers")}</p>
          </div>
        </div>
      </div>
      <div className="py-10 container">
        <span className="font-bold ">@MakeByManhCuong</span>
      </div>
    </footer>
  );
};

export default Footer;
