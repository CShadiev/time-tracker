import { Drawer } from "antd";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setAboutDrawerOpen } from "../taskPanel/taskPanelSlice";

export const AboutDrawer: FC = () => {
  const isOpen = useAppSelector((state) => state.taskPanel.aboutDrawerOpen);
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(setAboutDrawerOpen(false));
  };

  return (
    <Drawer
      placement="right"
      closable={true}
      open={isOpen}
      title={"About"}
      size="large"
      onClose={handleClose}
    >
      <div
        style={{
          fontSize: "1rem",
          lineHeight: "1.7rem",
          display: "flex",
          flexDirection: "column",
          gap: ".8rem",
        }}
      >
        <h2>What is Time Tracker?</h2>
        <p>
          Time tracker is a tool that applies Pomodoro Technique to working on
          projects. The purpose of this tool is to help you organize your
          projects and related tasks, and stay focused on completing them.
        </p>
        <h2>What is Pomodoro Technique?</h2>
        <p>
          The Pomodoro Technique was created by Francesco Cirillo for a more
          productive way to work and study. The technique uses a timer to break
          down work into intervals, traditionally 25 minutes in length,
          separated by short breaks. Each interval is known as a pomodoro, from
          the Italian word for 'tomato', after the tomato-shaped kitchen timer
          that Cirillo used as a university student.
          <br />
          <a href="https://en.wikipedia.org/wiki/Pomodoro_Technique">
            - Wikipedia
          </a>
        </p>
        <h2>How to use Time Tracker?</h2>
        <ol>
          <li>
            Add your projects and tasks, you can even break your tasks into
            subtasks, this will help you track how much time you have spent
            working on each task/project.
          </li>
          <li>
            Pick a task or a subtask you want to focus on and press the 'start'
            button.
          </li>
          <li>
            Do your best to not get distracted on anything else while the timer
            is on.
            <br />
            <i className="info" style={{ fontSize: ".9rem" }}>
              tip: keep handy a notebook: if something comes up unrelated to
              your task at hand, write yourself a reminder, so you can get back
              to it right after your current session is over.
            </i>
          </li>
          <li>
            When the timer is up, take a short break, you deserve it! You will
            hear a notification sound to let you know that your session is over.
            Please, make sure that your browser is not muted. The time you have
            spent on your task will be automatically recorded.
          </li>
        </ol>
        <h2>Features</h2>
        <ul>
          <li>
            <b>Toggle autostart:</b> you can set the timer to start a new
            session automatically when the previous one is over (in the
            settings).
          </li>
          <li>
            <b>Performance chart:</b> you can see how much time you have spent
            on focused work on previous days to get an idea of your relative
            productivity. You can <i>hover over</i> to see exact numbers for
            each day, you can also <i>use wheel to expand or reduce</i> the time
            interval displayed, up to 30 days.
          </li>
          <li>
            In the <b>Journal</b> you can see the list of your today's sessions
            and the total time you have spent on tasks.
          </li>
        </ul>
      </div>
    </Drawer>
  );
};
