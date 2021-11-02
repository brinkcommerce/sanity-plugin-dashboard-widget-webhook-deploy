/* eslint-disable react/jsx-no-bind */
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import DefaultButton from 'part:@sanity/components/buttons/default'
import styles from './style.css'

const defaultProps = {
  builds: [],
  previews: [],
  overrideStrings: {
    title: 'Build and deploy to production',
    previewTitle: 'Preview',
    previewLinkText: 'Go to preview site',
    previewButtonText: 'Start preview server',
    errorMessage: 'Could not deploy',
  },
}

const WebhookDeploy = (props) => {
  const [errorDeploy, setErrorDeploy] = useState(false)
  const [errorPreview, setErrorPreview] = useState(false)
  const [building, setBuilding] = useState(null)
  const [buildingPreview, setBuildingPreview] = useState(null)
  const [flags, setFlags] = useState([])
  const {builds, previews} = props
  const strings = Object.assign({}, defaultProps.overrideStrings, props.overrideStrings)

  useEffect(() => {
    if (building) {
      setTimeout(() => setBuilding(null), 7000)
    }
    if (buildingPreview) {
      setTimeout(() => setBuildingPreview(false), 7000)
    }
  }, [building, buildingPreview])

  useEffect(() => {
    const context = require.context('./flags', true, /.svg$/)
    setFlags(
      context.keys().reduce((acc, key) => {
        const fileName = key.match(/(\w+)/)[0]
        return {
          ...acc,
          [fileName]: context(key),
        }
      }, {})
    )
  }, [])

  const postBuild = (url) => {
    fetch(url, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      mode: 'no-cors',
    }).catch((error) => {
      setErrorDeploy(true)
    })
  }

  const postAllBuild = () => {
    setBuilding('ALL')
    builds.forEach((build) => postBuild(build.buildHook))
  }

  const postSingleBuild = (name, buildHook) => {
    setBuilding(name)
    postBuild(buildHook)
  }

  const postPreview = (url) => {
    fetch(url, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      mode: 'no-cors',
    }).catch((error) => {
      setErrorPreview(true)
    })
  }

  const postAllPreviews = () => {
    setBuildingPreview('ALL')
    previews.forEach((preview) => postPreview(preview.previewHook))
  }

  const postSinglePreview = (name, previewHook) => {
    setBuildingPreview(name)
    postPreview(previewHook)
  }

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>{strings.title}</h2>
        </header>
        {!builds?.length > 0 ? (
          <div className={styles.content}>
            You need to add atleast on build to your dashboardConfig.js, before using this plugin
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.builds}>
              {builds
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((build) => (
                  <div className={styles.section} key={build.name}>
                    <DefaultButton
                      disabled={building}
                      inverted
                      onClick={() => postSingleBuild(build.name, build.buildHook)}
                      className={styles.button}
                    >
                      <img src={flags[build.name.toLowerCase()]} />
                      {building === build.name || building === 'ALL' ? (
                        <span style={{color: 'green'}}> Deploying</span>
                      ) : (
                        `Deploy ${build.name}`
                      )}
                    </DefaultButton>
                    <a
                      className={styles.link}
                      href={`https://www.${build.buildUrl}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {build.buildUrl}
                    </a>
                  </div>
                ))}
            </div>
            {builds?.length > 1 && (
              <div className={styles.deployAllContainer}>
                <DefaultButton
                  disabled={building}
                  inverted
                  onClick={() => postAllBuild()}
                  className={styles.allButton}
                >
                  {building === 'ALL' ? (
                    <span style={{color: 'green'}}> Deploying</span>
                  ) : (
                    'Deploy all'
                  )}
                </DefaultButton>
              </div>
            )}
            {errorDeploy && (
              <div style={{color: 'red'}} className={styles.footer}>
                {strings.errorMessage}
              </div>
            )}
          </div>
        )}
      </div>
      {previews?.length > 0 && (
        <div className={styles.container}>
          <header className={styles.header}>
            <h2 className={styles.title}>{strings.previewTitle}</h2>
          </header>
          <div className={styles.content}>
            <div className={styles.previews}>
              {previews
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((preview) => (
                  <div className={styles.section} key={preview.name}>
                    <DefaultButton
                      disabled={buildingPreview}
                      inverted
                      onClick={() => postSinglePreview(preview.name, preview.previewHook)}
                      className={styles.button}
                    >
                      <img src={flags[preview.name.toLowerCase()]} />
                      {buildingPreview === preview.name || buildingPreview === 'ALL' ? (
                        <span style={{color: 'green'}}> Starting</span>
                      ) : (
                        `Start ${preview.name}`
                      )}
                    </DefaultButton>
                    <a
                      className={styles.link}
                      href={preview.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {strings.previewLinkText}
                    </a>
                  </div>
                ))}
            </div>
            {previews?.length > 1 && (
              <div className={styles.deployAllContainer}>
                <DefaultButton
                  disabled={buildingPreview}
                  inverted
                  onClick={() => postAllPreviews()}
                  className={styles.allButton}
                >
                  {buildingPreview === 'ALL' ? (
                    <span style={{color: 'green'}}> Starting</span>
                  ) : (
                    'Start all'
                  )}
                </DefaultButton>
              </div>
            )}
            {errorPreview && (
              <div style={{color: 'red'}} className={styles.footer}>
                {strings.errorMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

WebhookDeploy.propTypes = {
  builds: PropTypes.arrayOf({}),
  previews: PropTypes.arrayOf({}),
  overrideStrings: PropTypes.shape({
    title: PropTypes.string,
    previewTitle: PropTypes.string,
    previewLinkText: PropTypes.string,
    previewButtonText: PropTypes.string,
    errorMessage: PropTypes.string,
  }),
}

WebhookDeploy.defaultProps = defaultProps

export default {
  name: 'webhook-deploy',
  component: WebhookDeploy,
}
