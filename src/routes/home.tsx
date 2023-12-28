import {auth} from "../firebase";
import PostTweetForm from "../components/post-tweet-form";
import styled from "styled-components";

export default function Home(){
  return <Wrapper>
    <PostTweetForm/>
  </Wrapper>
}

const Wrapper = styled.div``
