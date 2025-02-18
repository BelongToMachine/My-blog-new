# Development branch explanation:

main - This is for update the backbone of the application, in addition, should update blog here

feature/... - This is for developing the main feature of the application

bugfix/... - This is for fixing the main bug of the application

CN-pro - This is for Chinese version production

-- When ready for production, should merge 'feature/...' and 'bugfix/...' into CN-pro, should merge main into CN-pro

-- After finish developing on 'feature/...' and 'bugfix/...' should merge them into main

-- Everytime create a new branch 'feature/...' and 'bugfix/...' should create them from main, so keep in mind that main should be updated before create a new branch from it

Prisma explanation:

For development, we should track migration folder and file in git too

In my Mac computer, we get the migration record for production database [Supabase: my-site]

[] If I understand correctly, to check the migration record in real database with source code, make them consistent before deployment

In my windows pc, we need to track migration record in git, and they are using the development database [Supabase: my-blog-test]

# CSS Module explanation:

In React, CSS Modules allow you to scope your CSS locally to a component, ensuring that the styles you write are applied only to that component and not globally. This helps to avoid style conflicts that can arise from global styles affecting multiple parts of the application.

How CSS Modules Work in React:
Local Scoping: Each class name in a CSS Module is scoped locally to the component where it is imported. When you import a CSS file as a module, class names are automatically transformed to be unique, preventing conflicts with other components.

Naming Convention: Instead of writing className="button", you will access the styles through an imported object. The keys of this object correspond to the class names, and the values are the unique, generated class names.

CSS Modules in Action: When you use className={styles.button}, React will automatically assign the appropriate class name (like Button_button\_\_1k2p4) to the button, so the styles will be scoped only to that button.

example:

```js
import React, { useState } from "react"
import styles from "./Button.module.css"

const Button = () => {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(!isClicked)
  }

  return (
    <button
      className={`${styles.button} ${isClicked ? styles.clicked : ""}`}
      onClick={handleClick}
    >
      {isClicked ? "Clicked!" : "Click Me"}
    </button>
  )
}

export default Button
```
