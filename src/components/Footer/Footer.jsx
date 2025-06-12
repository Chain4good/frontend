import React from "react";

const Footer = () => {
  return (
    <footer className="px-4 md:px-0">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
        <div>
          <p className="text-lg font-semibold mb-3">{"Donate.title"}</p>
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">
              {"Donate.categories"}
            </p>
            <p className="text-sm text-muted-foreground">
              {"Donate.crisisRelief"}
            </p>
            <p className="text-sm text-muted-foreground">
              {"Donate.socialFunds"}
            </p>
            <p className="text-sm text-muted-foreground">
              {"Donate.supporterSpace"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold mb-3">{"Fundraise.title"}</p>
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">{"Fundraise.howTo"}</p>
            <p className="text-sm text-muted-foreground">
              {"Fundraise.fundraising"}
            </p>
            <p className="text-sm text-muted-foreground">{"Fundraise.team"}</p>
            <p className="text-sm text-muted-foreground">{"Fundraise.blog"}</p>
            <p className="text-sm text-muted-foreground">
              {"Fundraise.charity"}
            </p>
            <p className="text-sm text-muted-foreground">
              {"Fundraise.SignUp"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold mb-3">{"About.title"}</p>
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">{"About.how"}</p>
            <p className="text-sm text-muted-foreground">{"About.blog"}</p>
            <p className="text-sm text-muted-foreground">{"About.charity"}</p>
            <p className="text-sm text-muted-foreground">{"About.signUp"}</p>
            <p className="text-sm text-muted-foreground">{"About.newsroom"}</p>
            <p className="text-sm text-muted-foreground">{"About.careers"}</p>
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold mb-3">Help Center</p>
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">{"About.how"}</p>
            <p className="text-sm text-muted-foreground">{"About.blog"}</p>
            <p className="text-sm text-muted-foreground">{"About.charity"}</p>
            <p className="text-sm text-muted-foreground">{"About.signUp"}</p>
            <p className="text-sm text-muted-foreground">{"About.newsroom"}</p>
            <p className="text-sm text-muted-foreground">{"About.careers"}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
